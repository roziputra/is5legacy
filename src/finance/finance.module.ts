import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { StockInvoiceRepository } from './repositories/stock-invoice-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockInvoice } from './entities/stock-invoice.entity';

@Module({
  controllers: [FinanceController],
  providers: [FinanceService, StockInvoiceRepository],
})
export class FinanceModule {}
