import { HttpStatus, Injectable } from '@nestjs/common';
import { StbEngineerRepository } from './repositories/stb-engineer.repository';
import { CreateStbEngineerDto } from './dto/create-stb-engineer.dto';
import { DataSource, Not, Repository } from 'typeorm';
import { Is5LegacyException } from 'src/exceptions/is5-legacy.exception';
import {
  RequestType,
  Status,
  StbEngineer,
} from './entities/stb-engineer.entity';
import { UpdateStbEngineerDto } from './dto/update-stb-engineer.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { BRANCH_MEDAN } from './entities/master.entity';
import { RequestStbPackageRepository } from './repositories/request-stb-package.repository';
import { Master } from './entities/master.entity';
import { MasterRepository } from './repositories/master.repository';
import { StbEngineerDetailRepository } from './repositories/stb-engineer-detail.repository';
import {
  EMP_JOIN_STATUS_QUIT,
  Employee,
  JOB_TITLE_CUSTOMER_ENGINEER,
} from 'src/employees/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StbEngineerService {
  constructor(
    private readonly stbEngineerRepository: StbEngineerRepository,
    private readonly dataSource: DataSource,
    private readonly stbEngineerDetailRepository: StbEngineerDetailRepository,
    private readonly requestStbPackageRepository: RequestStbPackageRepository,
    private readonly masterRepository: MasterRepository,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createStbEngineerDto: CreateStbEngineerDto, user) {
    const transaction = this.dataSource.createQueryRunner();
    await transaction.connect();
    await transaction.startTransaction();
    try {
      const stbEngineer =
        this.stbEngineerRepository.create(createStbEngineerDto);
      stbEngineer.createdBy = user['EmpId'];
      stbEngineer.branchId = this.getMasterBranch(user);
      const stbEngineerSaved = await transaction.manager.save(stbEngineer);
      const detail = this.stbEngineerDetailRepository.create(
        createStbEngineerDto.details,
      );
      await transaction.manager.save(
        detail.map((i) => {
          i.stbEngineerId = stbEngineerSaved.id;
          return i;
        }),
      );
      await transaction.commitTransaction();
      return stbEngineerSaved;
    } catch (e) {
      await transaction.rollbackTransaction();
      throw new Is5LegacyException('Failed create STB Enginer');
    } finally {
      await transaction.release();
    }
  }

  async update(
    updateStbEngineerDto: UpdateStbEngineerDto,
    stbEngineerId: number,
  ) {
    const stbEngineer = await this.stbEngineerRepository.findOne({
      where: {
        id: stbEngineerId,
      },
      relations: {
        details: true,
      },
    });
    if (!stbEngineer) {
      throw new Is5LegacyException(
        'STB engineer not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const transaction = this.dataSource.createQueryRunner();
    await transaction.connect();
    await transaction.startTransaction();
    try {
      const isDetails = updateStbEngineerDto.details ? true : false;
      if (isDetails) {
        await transaction.manager.remove(stbEngineer.details);
      }

      const data = this.stbEngineerRepository.create(updateStbEngineerDto);
      Object.assign(stbEngineer, data);
      const stbEngineerSaved = await transaction.manager.save(stbEngineer);
      const details = stbEngineer.details;
      if (isDetails) {
        await transaction.manager.save(
          details.map((i) => {
            i.stbEngineerId = stbEngineer.id;
            return i;
          }),
        );
      }
      await transaction.commitTransaction();
      return stbEngineerSaved;
    } catch (e) {
      await transaction.rollbackTransaction();
      throw new Is5LegacyException('Failed update STB enginer');
    } finally {
      await transaction.release();
    }
  }

  async findStbEngineer(stbEngineerId: number): Promise<StbEngineer> {
    const stbEngineer = await this.stbEngineerRepository.findOne({
      where: {
        id: stbEngineerId,
      },
    });
    if (!stbEngineer) {
      throw new Is5LegacyException(
        'STB enggineer not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return stbEngineer;
  }

  async remove(stbEngineerId: number): Promise<any> {
    const stbEngineer = await this.stbEngineerRepository.findOne({
      where: {
        id: stbEngineerId,
      },
      relations: {
        details: true,
      },
    });
    if (!stbEngineer) {
      throw new Is5LegacyException(
        'STB engineer not found',
        HttpStatus.NOT_FOUND,
      );
    }
    const transaction = this.dataSource.createQueryRunner();
    await transaction.connect();
    await transaction.startTransaction();
    try {
      await transaction.manager.remove(stbEngineer.details);
      await transaction.manager.remove(stbEngineer);
      await transaction.commitTransaction();
    } catch (error) {
      await transaction.rollbackTransaction();
      throw new Is5LegacyException('Failed delete STB engineer');
    } finally {
      await transaction.release();
    }
  }

  findEngineerInventory(engineerId: string, search: string): Promise<any> {
    return this.stbEngineerDetailRepository.findEngineerInventory(
      engineerId,
      search,
    );
  }

  async findAllStbEnginer(
    options: IPaginationOptions,
    requestType: RequestType,
    status: Status,
  ): Promise<Pagination<StbEngineer>> {
    return paginate<StbEngineer>(this.stbEngineerRepository, options, {
      where: {
        requestType: requestType,
        stbRequest: {
          status: status,
        },
      },
    });
  }

  async getInventoryByStbId(stbEngineerId: number) {
    const stbEngineer = await this.stbEngineerRepository.findOne({
      where: {
        id: stbEngineerId,
      },
    });
    if (!stbEngineer) {
      throw new Is5LegacyException(
        'STB engineer not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.stbEngineerDetailRepository.getInventoryByStbId(stbEngineerId);
  }

  getMasterBranch(user): string {
    const branchId = user['BranchId'];
    const displayBranchId = user['DisplayBranchId'];
    if (!displayBranchId) {
      return branchId;
    }

    return branchId == BRANCH_MEDAN ? displayBranchId : branchId;
  }

  getPackages(): Promise<any> {
    return this.requestStbPackageRepository.find({
      relations: {
        details: true,
      },
    });
  }

  async findAllWarehouseInventories(
    page: number,
    limit: number,
    search: string,
    user: any,
  ): Promise<Pagination<Master>> {
    const branch = this.getMasterBranch(user);
    return this.masterRepository.findAllWarehouseInventories(
      {
        page: page,
        limit: limit,
      },
      search,
      branch,
    );
  }

  async findAllEngineer(): Promise<Employee[]> {
    return this.employeeRepository.findBy({
      JobTitle: JOB_TITLE_CUSTOMER_ENGINEER,
      EmpJoinStatus: Not(EMP_JOIN_STATUS_QUIT),
    });
  }
}
