import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { CustomerRepository } from './repositories/customer.repository';
import { NOCFiberRepository } from './repositories/noc-fiber.repository';
import { OperatorSubscriptionRepository } from './repositories/operator-subscription.repository';
import { CustomerVerifiedEmailRepository } from './repositories/customer-verified-email.repository';
import { CustomerTempRepository } from './repositories/customer-temp.repository';
import { CustomerSubscriptionRepository } from './repositories/customer-subsription.repository';
import { CustomerServiceHistoryRepository } from './repositories/customer-service-history.repository';
import { CustomerProfileHistoryRepository } from './repositories/customer-profile-history.repository';
import { CustomerPhonebookRepository } from './repositories/customer-phonebook.repository';
import { CustomerNpwpRepository } from './repositories/customer-npwp.repository';
import { CustomerInvoiceSignatureRepository } from './repositories/customer-invoice-signature.repository';
import { CustomerGlobalSearchRepository } from './repositories/customer-global-search.repository';
import { CustomerFixRepository } from './repositories/customer-fix.repository';
import { InvoiceTypeMonthRepository } from './repositories/invoice-type-month.repository';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { CustomerInvoiceRepository } from './repositories/customer-invoice.repository';
import { CustomersInvoiceService } from './customer-invoice.service';
import { CustomerInvoicePDFRepository } from './repositories/customer-invoice-pdf.repository';
import { CustomerSubscriptionController } from './customer-subscription.controller';
import { FiberVendorServicesRepository } from './repositories/fiber-vendor-services.repository';
import { OperatorSubscriptionController } from './operator-subscription.controller';
import { OperatorSubscriptionService } from './operator-subscription.service';
import { CustomerSubscriptionExtensionController } from './client/customer-subscription-extension.controller';
import { FollowUpServiceLogRepository } from './repositories/follow-up-service-log.repository';
import { CustomerLogCallRepository } from './repositories/customer-log-call.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [
    OperatorSubscriptionController,
    CustomerSubscriptionExtensionController,
    CustomersController,
    CustomerSubscriptionController,
  ],
  exports: [CustomersService],
  providers: [
    CustomerLogCallRepository,
    FollowUpServiceLogRepository,
    CustomersService,
    OperatorSubscriptionService,
    FiberVendorServicesRepository,
    CustomersInvoiceService,
    CustomerInvoicePDFRepository,
    CustomerRepository,
    CustomerVerifiedEmailRepository,
    CustomerTempRepository,
    CustomerSubscriptionRepository,
    CustomerServiceHistoryRepository,
    CustomerProfileHistoryRepository,
    CustomerPhonebookRepository,
    CustomerNpwpRepository,
    CustomerInvoiceSignatureRepository,
    CustomerGlobalSearchRepository,
    CustomerFixRepository,
    InvoiceTypeMonthRepository,
    CustomerInvoiceRepository,
    SubscriptionRepository,
    OperatorSubscriptionRepository,
    NOCFiberRepository,
  ],
})
export class CustomersModule {}
