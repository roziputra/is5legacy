import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { FinanceModule } from 'src/finance/finance.module';
import { StbEngineerController } from './stb-engineer.controller';
import { StbEngineerService } from './stb-engineer.service';
import { StbEngineerRepository } from './repositories/stb-engineer.repository';
import { EngineerInventoryController } from './engineer-inventory.controller';
import { RequestStbPackageRepository } from './repositories/request-stb-package.repository';
import { PackageController } from './package.controller';
import { MasterRepository } from './repositories/master.repository';
import { WarehouseInventoryController } from './warehouse-inventory.controller';
import { StbEngineerDetailRepository } from './repositories/stb-engineer-detail.repository';
import { StbRequestController } from './stb-request.controller';
import { StbRequestRepository } from './repositories/stb-request.repository';
import { StbRequestDetailRepository } from './repositories/stb-request-detail.repository';
import { StbRequestService } from './stb-request.service';
import { Employee } from 'src/employees/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StbTransferService } from './stb-transfer.service';
import { StbTransferController } from './stb-transfer.controller';
import { StbRequestDetailController } from './stb-request-detail.controller';
import { StbEngineerDetailController } from './stb-engineer-detail.controller';
import { TtbCustomerController } from './ttb-customer.controller';
import { TtbCustomerDetailController } from './ttb-customer-detail.controller';
import { TtbCustomerService } from './ttb-customer.service';
import { TtbCustomerDetailService } from './ttb-customer-detail.service';
import { TtbCustomerRepository } from './repositories/ttb-customer.repository';
import { TtbCustomerDetailRepository } from './repositories/ttb-customer-detail.repository';

@Module({
  imports: [FinanceModule, TypeOrmModule.forFeature([Employee])],
  controllers: [
    PackageController,
    TtbCustomerDetailController,
    TtbCustomerController,
    StbTransferController,
    StbRequestDetailController,
    StbRequestController,
    StbEngineerDetailController,
    StbEngineerController,
    WarehouseInventoryController,
    EngineerInventoryController,
    StockController,
  ],
  providers: [
    StockService,
    TtbCustomerDetailService,
    TtbCustomerService,
    StbTransferService,
    StbRequestService,
    StbEngineerService,
    TtbCustomerDetailRepository,
    TtbCustomerRepository,
    StbRequestRepository,
    StbRequestDetailRepository,
    StbEngineerRepository,
    StbEngineerDetailRepository,
    RequestStbPackageRepository,
    MasterRepository,
  ],
})
export class StockModule {}
