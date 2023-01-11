import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { AuthGuard } from '@nestjs/passport';
import { GetDepreciationFilterDto } from './dto/get-depreciation-filter.dto';

@UseGuards(AuthGuard('api-key'))
@Controller('finances')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}
  @Get('get-depreciation-stock-data')
  async getDepreciationData(
    @Query(new ValidationPipe({ transform: true }))
    getDepreciationFilterDto: GetDepreciationFilterDto,
  ): Promise<any> {
    return this.financeService.getDepreciationData(getDepreciationFilterDto);
  }

  @Get('get-total-depreciation')
  async getTotalDepreciation(
    @Query(new ValidationPipe({ transform: true }))
    getDepreciationFilterDto: GetDepreciationFilterDto,
  ): Promise<any> {
    return this.financeService.getTotalDepreciation(getDepreciationFilterDto);
  }

  @Get('get-total-depreciation-status')
  async getTotalDepreciationStatus(
    @Query(new ValidationPipe({ transform: true }))
    getDepreciationFilterDto: GetDepreciationFilterDto,
  ) {
    return this.financeService.getTotalDepreciationStatus(
      getDepreciationFilterDto,
    );
  }
}
