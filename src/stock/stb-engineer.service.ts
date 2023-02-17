import { HttpStatus, Injectable } from '@nestjs/common';
import { StbEngineerRepository } from './repositories/stb-engineer.repository';
import { CreateStbEngineerDto } from './dto/create-stb-engineer.dto';
import { DataSource } from 'typeorm';
import { StbEngineerBarangRepository } from './repositories/stb-engineer-barang.repository';
import { Is5LegacyException } from 'src/exceptions/is5-legacy.exception';
import {
  RequestType,
  Status,
  StbEngineer,
} from './entities/stb-engineer.entity';
import { UpdateStbEngineerDto } from './dto/update-stb-engineer.dto';
import { FilterEngineerInventoryDto } from './dto/filter-engineer-inventory.dto';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { BRANCH_MEDAN } from './entities/master.entity';
import { RequestStbPackageRepository } from './repositories/request-stb-package.repository';

@Injectable()
export class StbEngineerService {
  constructor(
    private readonly stbEngineerRepository: StbEngineerRepository,
    private readonly dataSource: DataSource,
    private readonly stbEngineerBarangRepository: StbEngineerBarangRepository,
    private readonly requestStbPackageRepository: RequestStbPackageRepository,
  ) {}

  async create(createStbEngineerDto: CreateStbEngineerDto, user) {
    const transaction = this.dataSource.createQueryRunner();
    await transaction.connect();
    await transaction.startTransaction();
    try {
      const stbEngineer =
        this.stbEngineerRepository.create(createStbEngineerDto);
      stbEngineer.createdBy = user['EmpId'];
      console.log(user['EmpId']);
      stbEngineer.branchId = this.getMasterBranch(user);
      const stbEngineerSaved = await transaction.manager.save(stbEngineer);
      const barang = this.stbEngineerBarangRepository.create(
        createStbEngineerDto.barangs,
      );
      await transaction.manager.save(
        barang.map((i) => {
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
        barangs: true,
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
      await transaction.manager.remove(stbEngineer.barangs);
      const data = this.stbEngineerRepository.create(updateStbEngineerDto);
      Object.assign(stbEngineer, data);
      const stbEngineerSaved = await transaction.manager.save(stbEngineer);
      const barangs = stbEngineer.barangs;
      await transaction.manager.save(
        barangs.map((i) => {
          i.stbEngineerId = stbEngineer.id;
          return i;
        }),
      );
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
        barangs: true,
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
      await transaction.manager.remove(stbEngineer.barangs);
      await transaction.manager.remove(stbEngineer);
      await transaction.commitTransaction();
    } catch (error) {
      await transaction.rollbackTransaction();
      throw new Is5LegacyException('Failed delete STB engineer');
    } finally {
      await transaction.release();
    }
  }

  findEngineerInventory(
    filterEngineerInventoryDto: FilterEngineerInventoryDto,
  ): Promise<any> {
    const { branch, engineer, search } = filterEngineerInventoryDto;

    return this.stbEngineerBarangRepository.findEngineerInventory(
      branch,
      engineer,
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
        status: status,
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
    return this.stbEngineerBarangRepository.getInventoryByStbId(stbEngineerId);
  }

  getMasterBranch(user): string {
    console.log(user);
    console.log(user['BranchId'], user['DisplayBranchId']);
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
}
