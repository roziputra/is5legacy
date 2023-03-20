import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { Is5LegacyException } from 'src/exceptions/is5-legacy.exception';
import { RequestType } from './entities/stb-engineer.entity';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { StbRequestRepository } from './repositories/stb-request.repository';
import { StbRequestDetailRepository } from './repositories/stb-request-detail.repository';
import { CreateStbRequestDto } from './dto/create-stb-request.dto';
import { UpdateStbRequestDto } from './dto/update-stb-request.dto';
import { STATUS_PENDING, Status, StbRequest } from './entities/stb-request.entity';
import { StbEngineerService } from './stb-engineer.service';
import { Employee } from 'src/employees/employee.entity';

@Injectable()
export class StbRequestService {
  constructor(
    private readonly stbRequestRepository: StbRequestRepository,
    private readonly dataSource: DataSource,
    private readonly stbRequestDetailRepository: StbRequestDetailRepository,
    private readonly stbEngineerService: StbEngineerService,
  ) {}

  async create(createStbRequestDto: CreateStbRequestDto, user) {
    const transaction = this.dataSource.createQueryRunner();
    await transaction.connect();
    await transaction.startTransaction();
    try {
      const stbRequest = this.stbRequestRepository.create(createStbRequestDto);
      stbRequest.createdBy = user['EmpId'];
      stbRequest.status = STATUS_PENDING;
      stbRequest.branchId = this.stbEngineerService.getMasterBranch(user);
      const stbRequestSaved = await transaction.manager.save(stbRequest);
      const detail = this.stbRequestDetailRepository.create(
        createStbRequestDto.details,
      );
      await transaction.manager.save(
        detail.map((i) => {
          i.stbRequestId = stbRequestSaved.id;
          return i;
        }),
      );
      await transaction.commitTransaction();
      return stbRequestSaved;
    } catch (e) {
      await transaction.rollbackTransaction();
      throw new Is5LegacyException('Gagal membuat permintaan STB');
    } finally {
      await transaction.release();
    }
  }

  async update(
    updateStbRequestDto: UpdateStbRequestDto,
    id: number,
    user: Employee,
  ) {
    const stbRequest = await this.stbRequestRepository.findOne({
      where: {
        id: id,
        createdBy: user.EmpId,
      },
      relations: {
        details: true,
      },
    });

    if (!stbRequest) {
      throw new Is5LegacyException(
        'Permintaan STB tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }

    if (stbRequest.status != STATUS_PENDING) {
      throw new Is5LegacyException(
        'Permintaan STB hanya boleh diupdate saat masih pending',
        HttpStatus.NOT_FOUND,
      );
    }
    const transaction = this.dataSource.createQueryRunner();
    await transaction.connect();
    await transaction.startTransaction();
    try {
      const isDetails = updateStbRequestDto.details ? true : false;
      if (isDetails) {
        await transaction.manager.remove(stbRequest.details);
      }

      const data = this.stbRequestRepository.create(updateStbRequestDto);
      Object.assign(stbRequest, data);
      const stbRequestSaved = await transaction.manager.save(stbRequest);
      const details = stbRequest.details;
      if (isDetails) {
        await transaction.manager.save(
          details.map((i) => {
            i.stbRequestId = stbRequest.id;
            return i;
          }),
        );
      }
      await transaction.commitTransaction();
      return stbRequestSaved;
    } catch (e) {
      await transaction.rollbackTransaction();
      throw new Is5LegacyException('Gagal update permintaan STB');
    } finally {
      await transaction.release();
    }
  }

  async findStbRequest(id: number): Promise<StbRequest> {
    const stbRequest = await this.stbRequestRepository.findOneStbRequest(id);
    if (!stbRequest) {
      throw new Is5LegacyException(
        'Permintaan STB tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    return stbRequest;
  }

  findAllRequestDetails(id: number) {
    return this.stbRequestDetailRepository.findAllDetails(id);
  }

  async remove(id: number, user: Employee): Promise<any> {
    const stbRequest = await this.stbRequestRepository.findOne({
      where: {
        id: id,
        createdBy: user.EmpId,
      },
      relations: {
        details: true,
      },
    });
    if (!stbRequest) {
      throw new Is5LegacyException(
        'Permintaan STB tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }

    if (stbRequest.status != STATUS_PENDING) {
      throw new Is5LegacyException(
        'Permintaan STB hanya boleh dihapus saat masih pending',
        HttpStatus.NOT_FOUND,
      );
    }
    const transaction = this.dataSource.createQueryRunner();
    await transaction.connect();
    await transaction.startTransaction();
    try {
      await transaction.manager.remove(stbRequest.details);
      await transaction.manager.remove(stbRequest);
      await transaction.commitTransaction();
    } catch (error) {
      await transaction.rollbackTransaction();
      throw new Is5LegacyException('Gagal menghapus permintaan STB');
    } finally {
      await transaction.release();
    }
  }

  async findAllStbRequest(
    requestType: RequestType[],
    status: Status[],
    options: IPaginationOptions,
  ): Promise<Pagination<StbRequest>> {
    return this.stbRequestRepository.finAllStbRequest(
      requestType,
      status,
      options,
    );
  }
}
