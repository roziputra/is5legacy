import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { FinanceModule } from 'src/finance/finance.module';
import { StbEngineerController } from './stb-engineer.controller';
import { StbEngineerService } from './stb-engineer.service';
import { StbEngineerRepository } from './repositories/stb-engineer.repository';
import { StbEngineerBarangRepository } from './repositories/stb-engineer-barang.repository';
import { EngineerInventoryController } from './engineer-inventory.controller';
import { RequestStbPackageRepository } from './repositories/request-stb-package.repository';
import { PackageController } from './package.controller';

@Module({
  imports: [FinanceModule],
  controllers: [
    PackageController,
    StbEngineerController,
    EngineerInventoryController,
    StockController,
  ],
  providers: [
    StockService,
    StbEngineerService,
    StbEngineerRepository,
    StbEngineerBarangRepository,
    RequestStbPackageRepository,
  ],
})
export class StockModule {}
