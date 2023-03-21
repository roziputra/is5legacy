import { Injectable } from '@nestjs/common';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Master } from './entities/master.entity';
import { MasterRepository } from './repositories/master.repository';
import { StbEngineerService } from './stb-engineer.service';
import { FilterStockMasterDto } from './dto/filter-stock-master.dto';

@Injectable()
export class StockMasterService {
  constructor(
    private readonly masterRepository: MasterRepository,
    private readonly stbEngineerService: StbEngineerService,
  ) {}

  async findAll(
    filterStockMasterDto: FilterStockMasterDto,
    options: IPaginationOptions,
  ): Promise<Pagination<Master>> {
    const { search, branchId, isActive } = filterStockMasterDto;
    return this.masterRepository.findAllStock(
      branchId,
      search,
      isActive,
      options,
    );
  }
}
