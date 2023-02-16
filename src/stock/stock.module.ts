import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { FinanceModule } from 'src/finance/finance.module';
import { StbEngineerController } from './stb-engineer.controller';
import { StbEngineerService } from './stb-engineer.service';
import { StbEngineerRepository } from './repositories/stb-engineer.repository';
import { StbEngineerBarangRepository } from './repositories/stb-engineer-barang.repository';

@Module({
  imports: [FinanceModule],
  controllers: [StockController, StbEngineerController],
  providers: [
    StockService,
    StbEngineerService,
    StbEngineerRepository,
    StbEngineerBarangRepository,
  ],
})
export class StockModule {}
