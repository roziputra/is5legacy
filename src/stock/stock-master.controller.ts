import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/employees/current-user.decorator';
import { Employee } from 'src/employees/employee.entity';
import { FilterPaginationDto } from './dto/filter-pagination.dto';
import { StockMasterService } from './stock-master.service';
import { FilterStockMasterDto } from './dto/filter-stock-master.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stock/masters')
export class StockMasterController {
  constructor(private readonly stockMasterService: StockMasterService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() filterPaginationDto: FilterPaginationDto,
    @Query() filterStockMasterDto: FilterStockMasterDto,
  ): Promise<any> {
    const { page, limit } = filterPaginationDto;
    return this.stockMasterService.findAll(filterStockMasterDto, {
      page: page,
      limit: limit,
    });
  }
}
