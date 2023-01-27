import { Module } from '@nestjs/common';
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

@Module({
  controllers: [CustomersController],
  exports: [CustomersService],
  providers: [
    CustomersService,
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
    OperatorSubscriptionRepository,
    NOCFiberRepository,
  ],
})
export class CustomersModule {}
