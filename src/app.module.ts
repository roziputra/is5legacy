import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
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
import { GeneralTicketPic } from './tickets/entities/general-ticket-pic.entity';
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
import { CustomerService } from './customers/entities/customer-service.entity';
import { CustomerInvoice } from './customers/entities/customer-invoice.entity';
import { CustomerInvoicePDF } from './customers/entities/customer-invoice-pdf.entity';
import { CustomerSysConf } from './customers/entities/sysconf.entity';
import { StbEngineer } from './stock/entities/stb-engineer.entity';
import { RequestStbPackage } from './stock/entities/request-stb-package.entity';
import { RequestStbPackageDetail } from './stock/entities/request-stb-package-detail.entity';
import { Master } from './stock/entities/master.entity';
import { StbEngineerDetail } from './stock/entities/stb-engineer-detail.entity';
import { StbRequest } from './stock/entities/stb-request.entity';
import { StbRequestDetail } from './stock/entities/stb-request-detail.entity';
import { FiberVendorServices } from './customers/entities/fiber-vendor-services.entity';
import { Box } from './stock/entities/box.entity';
import { TicketPic } from './tickets/entities/ticket-pic.entity';
import { TtbCustomer } from './stock/entities/ttb-customer.entity';
import { TtbCustomerDetail } from './stock/entities/ttb-customer-detail.entity';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: process.env.MAIL_USERNAME,
      },
      template: {
        dir: __dirname + '/templates/mails',
        options: {
          strict: true,
        },
      },
    }),
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
        GeneralTicketPic,
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
        CustomerInvoice,
        CustomerService,
        CustomerInvoicePDF,
        CustomerSysConf,
        StbEngineer,
        StbEngineerDetail,
        StbRequest,
        StbRequestDetail,
        RequestStbPackage,
        RequestStbPackageDetail,
        Master,
        FiberVendorServices,
        Box,
        TicketPic,
        TtbCustomer,
        TtbCustomerDetail,
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
