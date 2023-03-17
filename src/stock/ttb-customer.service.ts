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
import { InjectPage } from 'nest-puppeteer';
import { Page } from 'puppeteer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TtbCustomerService {
  constructor(
    private readonly ttbCustomerRepository: TtbCustomerRepository,
    private readonly ttbCustomerDetailRepository: TtbCustomerDetailRepository,
    private readonly dataSource: DataSource,
    private readonly stbEngineerService: StbEngineerService,
    private readonly configService: ConfigService,
    @InjectPage() private readonly page: Page,
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

  async findAllTtb(): Promise<any> {
    return this.ttbCustomerRepository.findAllTtb();
  }

  async createPdf(id: number): Promise<any> {
    const frontEndUrl = `${this.configService.get(
      'FRONTEND_URL',
    )}:${this.configService.get('PORT')}`;

    await this.page.goto(`${frontEndUrl}/v1/stock/ttb/${id}/pdf/view`, {
      waitUntil: 'networkidle2',
    });

    const buffer = await this.page.pdf({
      format: 'A4',
      printBackground: false,
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
