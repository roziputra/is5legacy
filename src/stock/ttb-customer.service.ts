import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Is5LegacyException } from 'src/exceptions/is5-legacy.exception';
import { CreateTtbCustomerDto } from './dto/create-ttb-customer.dto';
import { TtbCustomerRepository } from './repositories/ttb-customer.repository';
import { TtbCustomerDetailRepository } from './repositories/ttb-customer-detail.repository';
import { UpdateTtbCustomerDto } from './dto/update-ttb-customer.dto';
import { TtbCustomer } from './entities/ttb-customer.entity';
import { StbEngineerService } from './stb-engineer.service';
import { Employee } from 'src/employees/employee.entity';
import { TtbCustomerAttachment } from './entities/ttb-customer-attachment.entity';
import { ConfigService } from '@nestjs/config';
import puppeteer from 'puppeteer';
import { MailerService } from '@nestjs-modules/mailer';
import { DateFormat } from 'src/utils/date-format';
import { TtbCustomerAttachmentRepository } from './repositories/ttb-customer-attachment.repository';
import { join, resolve } from 'path';
import { compile } from 'handlebars';
import { readFileSync } from 'fs';

@Injectable()
export class TtbCustomerService {
  constructor(
    private readonly ttbCustomerRepository: TtbCustomerRepository,
    private readonly ttbCustomerDetailRepository: TtbCustomerDetailRepository,
    private readonly ttbCustomerAttachmentRepository: TtbCustomerAttachmentRepository,
    private readonly dataSource: DataSource,
    private readonly stbEngineerService: StbEngineerService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async create(
    createTtbCustomerDto: CreateTtbCustomerDto,
    files: Array<Express.Multer.File>,
    user: Employee,
  ) {
    const transaction = this.dataSource.createQueryRunner();
    await transaction.connect();
    await transaction.startTransaction();
    try {
      const ttbCustomer =
        this.ttbCustomerRepository.create(createTtbCustomerDto);
      ttbCustomer.createdBy = user.EmpId;
      ttbCustomer.branchId = this.stbEngineerService.getMasterBranch(user);
      const ttbCustomerSaved = await transaction.manager.save(ttbCustomer);
      const detail = this.ttbCustomerDetailRepository.create(
        createTtbCustomerDto.details,
      );
      await transaction.manager.save(
        detail.map((i) => {
          i.ttbCustomerId = ttbCustomerSaved.id;
          return i;
        }),
      );
      const ttbCustomerAttachments = files.map((i) => {
        const files = new TtbCustomerAttachment();
        files.ttbCustomerId = ttbCustomerSaved.id;
        files.filename = i.filename;
        files.filepath = i.path;
        return files;
      });
      await transaction.manager.save(ttbCustomerAttachments);
      await transaction.commitTransaction();
      return ttbCustomerSaved;
    } catch (e) {
      await transaction.rollbackTransaction();
      throw new Is5LegacyException('Gagal membuat TTB customer');
    } finally {
      await transaction.release();
    }
  }

  async update(
    updateTtbCustomerDto: UpdateTtbCustomerDto,
    ttbCustomerId: number,
  ) {
    const ttbCustomer = await this.ttbCustomerRepository.findOne({
      where: {
        id: ttbCustomerId,
      },
      relations: {
        details: true,
      },
    });
    if (!ttbCustomer) {
      throw new Is5LegacyException(
        'TTB customer tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    const transaction = this.dataSource.createQueryRunner();
    await transaction.connect();
    await transaction.startTransaction();
    try {
      const isDetails = updateTtbCustomerDto.details ? true : false;
      if (isDetails) {
        await transaction.manager.remove(ttbCustomer.details);
      }

      const data = this.ttbCustomerRepository.create(updateTtbCustomerDto);
      Object.assign(ttbCustomer, data);
      const ttbCustomerSaved = await transaction.manager.save(ttbCustomer);
      const details = ttbCustomer.details;
      if (isDetails) {
        await transaction.manager.save(
          details.map((i) => {
            i.ttbCustomerId = ttbCustomer.id;
            return i;
          }),
        );
      }
      await transaction.commitTransaction();
      return ttbCustomerSaved;
    } catch (e) {
      await transaction.rollbackTransaction();
      throw new Is5LegacyException('Gagal update TTB customer');
    } finally {
      await transaction.release();
    }
  }

  async findOneTtb(id: number): Promise<TtbCustomer> {
    const ttbCustomer = await this.ttbCustomerRepository.findOneTtb(id);
    if (!ttbCustomer) {
      throw new Is5LegacyException(
        'TTB customer tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    return ttbCustomer;
  }

  async remove(id: number): Promise<any> {
    const ttbCustomer = await this.ttbCustomerRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        details: true,
      },
    });
    if (!ttbCustomer) {
      throw new Is5LegacyException(
        'TTB customer tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    const transaction = this.dataSource.createQueryRunner();
    await transaction.connect();
    await transaction.startTransaction();
    try {
      await transaction.manager.remove(ttbCustomer.details);
      await transaction.manager.remove(ttbCustomer);
      await transaction.commitTransaction();
    } catch (error) {
      await transaction.rollbackTransaction();
      throw new Is5LegacyException('Gagal menghapus TTB customer');
    } finally {
      await transaction.release();
    }
  }

  async findAllTtb(
    branchId: string[],
    engineerId: string[],
    page: number,
    limit: number,
  ): Promise<any> {
    return this.ttbCustomerRepository.findAllTtb(branchId, engineerId, {
      page: page,
      limit: limit,
    });
  }

  async sendTtbEmail(id) {
    const frontEndUrl = `${this.configService.get('FRONTEND_URL')}`;
    const ttb = await this.ttbCustomerRepository.findOneTtb(id);
    const details = await this.ttbCustomerDetailRepository.findAllDetails(id);
    const attachment = await this.ttbCustomerAttachmentRepository.findBy({
      ttbCustomerId: id,
    });

    const mailAttachment = attachment.map(function (item) {
      return {
        filename: item.filename,
        path: resolve(item.filepath),
      };
    });

    mailAttachment.push({
      filename: `${ttb.noSurat}.pdf`,
      path: resolve(`data/ttb/pdf/${ttb.noSurat}.pdf`),
    });

    const d = new DateFormat(ttb.date);
    await this.mailerService
      .sendMail({
        to: 'rozi@nusa.net.id', // list of receivers
        subject: 'Tanda Terima Barang', // Subject line
        template: 'stock/email/ttb-template',
        context: {
          frontEndUrl: frontEndUrl,
          ttb: ttb,
          details: details,
          ttbDate: d.toLongDateFormat(),
        },
        attachments: mailAttachment,
      })
      .catch((error) => {
        throw new Is5LegacyException('Gagal kirim email');
      });
  }

  /** dikomen sementara karena mau cari bugs */
  async createPdf(id: number): Promise<any> {
    const frontEndUrl = `${this.configService.get('FRONTEND_URL')}`;
    const ttb = await this.ttbCustomerRepository.findOneTtb(id);
    const details = await this.ttbCustomerDetailRepository.findAllDetails(id);
    const d = new DateFormat(ttb.date);
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const source = readFileSync(
      join('views', 'stock/ttb-template.hbs'),
      'utf8',
    ).toString();
    const compiledHtml = compile(source);
    const content = compiledHtml(
      {
        frontEndUrl: frontEndUrl,
        ttb: ttb,
        details: details,
        ttbDate: d.toLongDateFormat(),
      },
      {
        helpers: {
          increment: (n) => n + 1,
        },
      },
    );
    const page = await browser.newPage();
    await page.setContent(content);
    const buffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
      },
    });
    return buffer;
  }
}
