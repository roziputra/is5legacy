import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { IndexModule } from './index/index.module';
import { CustomersModule } from './customers/customers.module';
import { EmployeesModule } from './employees/employees.module';
import { Employee } from './employees/employee.entity';
import { Tts, TtsPIC, TtsChange, Ttschange } from './tickets/tickets.entity';
import { TtsModule } from './tickets/tickets.module';
import { NOCFiber } from './customers/entities/noc-fiber.entity';
import { SalesPromoModule } from './sales-promo/sales-promo.module';
import { SalesPromo } from './sales-promo/sales-promo.entity';
import { ServicesModule } from './services/services.module';
import { CustomerServiceTechnicalCustom } from './customers/entities/customer-service-technical-custom.entity';
import { Customer } from './customers/entities/customer.entity';
import { SMSPhonebook } from './customers/entities/sms-phonebook.entity';
import { Subscription } from './customers/entities/subscriber.entity';
import { NPWPCustomer } from './customers/entities/customer-npwp.entity';
import { Services } from './services/entities/service.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { IsoDocument } from './tickets/entities/iso-document.entity';
import { GeneralTicket } from './tickets/entities/general-ticket.entity';
import { TicketPic } from './tickets/entities/ticket-pic.entity';
import { CronModule } from './cron/cron.module';
import { FinanceModule } from './finance/finance.module';
import { StockInvoice } from './finance/entities/stock-invoice.entity';
import { GeneralJournalBatchNo } from './finance/entities/general-journal-batch-no.entity';
import { GeneralJournal } from './finance/entities/general-journal.entity';
import { StockModule } from './stock/stock.module';
import { CustomerInvoiceSignature } from './customers/entities/customer-invoice-signature.entity';
import { CustomerFix } from './customers/entities/customer-fix.entity';
import { CustomerProfileHistory } from './customers/entities/customer-profile-history.entity';
import { CustomerVerifiedEmail } from './customers/entities/customer-verified-email.entity';
import { CustomerTemp } from './customers/entities/customer-temp.entity';
import { CustomerGlobalSearch } from './customers/entities/customer-global-search.entity';
import { CustomerServicesHistoryNew } from './customers/entities/customer-service-history-new.entity';
import { InvoiceTypeMonth } from './customers/entities/invoice-type-month.entity';
import { CustomerSalutation } from './customers/entities/salutation.entity';
import { CustomerSysConf } from './customers/entities/sysconf.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as 'mysql' | 'mariadb' | 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DBNAME,
      entities: [
        Employee,
        Tts,
        Customer,
        Subscription,
        SMSPhonebook,
        NPWPCustomer,
        TtsPIC,
        TtsChange,
        Ttschange,
        NOCFiber,
        CustomerServiceTechnicalCustom,
        SalesPromo,
        Services,
        IsoDocument,
        GeneralTicket,
        TicketPic,
        StockInvoice,
        GeneralJournalBatchNo,
        GeneralJournal,
        CustomerInvoiceSignature,
        CustomerFix,
        CustomerProfileHistory,
        CustomerVerifiedEmail,
        CustomerTemp,
        CustomerGlobalSearch,
        CustomerServicesHistoryNew,
        InvoiceTypeMonth,
        CustomerSalutation,
        CustomerSysConf,
      ],
      synchronize: false,
    }),
    AuthModule,
    IndexModule,
    CustomersModule,
    EmployeesModule,
    TtsModule,
    SalesPromoModule,
    ServicesModule,
    CronModule,
    FinanceModule,
    StockModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
