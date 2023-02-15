import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { StockInvoiceRepository } from './repositories/stock-invoice-repository';
import { GeneralJournalRepository } from './repositories/general-journal.repository';

@Module({
  providers: [FinanceService, StockInvoiceRepository, GeneralJournalRepository],
  exports: [FinanceService],
})
export class FinanceModule {}
