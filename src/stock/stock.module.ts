import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { FinanceModule } from 'src/finance/finance.module';

@Module({
  imports: [FinanceModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
