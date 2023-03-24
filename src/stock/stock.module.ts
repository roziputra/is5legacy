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
import { PackageDetailController } from './package-detail.controller';
import { PackageService } from './package.service';
import { RequestStbPackageDetailRepository } from './repositories/request-stb-package-detail.repository';
import { TtbController } from './ttb-controller';
import { TtbCustomerDetailController } from './ttb-customer-detail.controller';
import { TtbCustomerService } from './ttb-customer.service';
import { TtbCustomerDetailService } from './ttb-customer-detail.service';
import { TtbCustomerRepository } from './repositories/ttb-customer.repository';
import { TtbCustomerDetailRepository } from './repositories/ttb-customer-detail.repository';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { TtbPdfController } from './ttb-pdf-controller';
import { ConfigModule } from '@nestjs/config';
import { StockMasterController } from './stock-master.controller';
import { StockMasterService } from './stock-master.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { TtbCustomerAttachmentRepository } from './repositories/ttb-customer-attachment.repository';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './data/ttb',
        filename(req, file, callback) {
          callback(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
    MailerModule,
    ConfigModule,
    FinanceModule,
    TypeOrmModule.forFeature([Employee]),
  ],
  controllers: [
    StockMasterController,
    PackageDetailController,
    PackageController,
    TtbPdfController,
    TtbCustomerDetailController,
    TtbController,
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
    StockMasterService,
    PackageService,
    StockService,
    TtbCustomerDetailService,
    TtbCustomerService,
    StbTransferService,
    StbRequestService,
    StbEngineerService,
    TtbCustomerAttachmentRepository,
    TtbCustomerDetailRepository,
    TtbCustomerRepository,
    StbRequestRepository,
    StbRequestDetailRepository,
    StbEngineerRepository,
    StbEngineerDetailRepository,
    RequestStbPackageDetailRepository,
    RequestStbPackageRepository,
    MasterRepository,
  ],
})
export class StockModule {}
