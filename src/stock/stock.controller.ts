import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetDepreciationFilterDto } from 'src/finance/dto/get-depreciation-filter.dto';
import { FinanceService } from 'src/finance/finance.service';

@UseGuards(AuthGuard('api-key'))
@Controller('stocks')
export class StockController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('depreciation-list')
  async getDepreciationData(
    @Query(new ValidationPipe({ transform: true }))
    getDepreciationFilterDto: GetDepreciationFilterDto,
  ): Promise<any> {
    return this.financeService.getDepreciationData(getDepreciationFilterDto);
  }
}
