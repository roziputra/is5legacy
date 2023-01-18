import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { StockInvoiceRepository } from './repositories/stock-invoice-repository';

@Module({
  providers: [FinanceService, StockInvoiceRepository],
})
export class FinanceModule {}
