import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetDepreciationFilterDto } from 'src/finance/dto/get-depreciation-filter.dto';
import { FinanceService } from 'src/finance/finance.service';

@UseGuards(AuthGuard('api-key'))
@Controller('stocks')
export class StockController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('depreciation-list')
  async getDepreciationData(
    @Query()
    getDepreciationFilterDto: GetDepreciationFilterDto,
  ): Promise<any> {
    return this.financeService.getDepreciationData(getDepreciationFilterDto);
  }

  /**
   *
   * for testing total depreciation result
   * @param getDepreciationFilterDto
   * @returns
   */
  @Get('total-depreciation')
  async totalDepreciationPerMonth(
    @Query()
    getDepreciationFilterDto: GetDepreciationFilterDto,
  ): Promise<any> {
    const { branchId, period } = getDepreciationFilterDto;
    return this.financeService.getTotalDepreciationPerMonth(branchId, period);
  }
}
