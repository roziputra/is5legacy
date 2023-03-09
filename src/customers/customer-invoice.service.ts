import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SubscriptionRepository } from './repositories/subscription.repository';
import {
  CustomerInvoiceRepository,
  INVOICE_PAID_DATE_DEFAULT,
  INVOICE_STATUS_TAGIH,
  PERIODE_TYPE_DEFAULT,
  URUT_DEFAULT,
} from './repositories/customer-invoice.repository';
import { CustomerInvoice } from './entities/customer-invoice.entity';
import {
  CHARGE_TYPE_ADD,
  CHARGE_TYPE_FREE,
  ChargeColumn,
  ChargeType,
} from './utils/charge-column';
import {
  DIVIDER_TYPE_LAYANAN,
  DividerType,
  ServiceDivider,
} from './utils/service-divider';
import process from 'process';
import { CustomerInvoicePDF } from './entities/customer-invoice-pdf.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { Is5LegacyException } from 'src/exceptions/is5-legacy.exception';
import { Services } from 'src/services/entities/service.entity';
import { CustomerConfirmationDto } from './dtos/customer-confirmation.dto';
import {
  CONFIRMATION_TIPE_CLOSE,
  CONFIRMATION_TIPE_PERPANJANG,
  EMPLOYEE_ID_SYSTEM,
} from './entities/follow-up-service-log.entity';
import { FollowUpServiceLogRepository } from './repositories/follow-up-service-log.repository';
import { CustomerLogCallRepository } from './repositories/customer-log-call.repository';
import {
  STATUS_DONE,
  SUBJECT_CUSTOMER_PERPANJANG,
  VIA_CALL_OUT,
} from './entities/customer-log-call.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomersInvoiceService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly customerInvoiceRepository: CustomerInvoiceRepository,
    private readonly followUpServiceLogRepository: FollowUpServiceLogRepository,
    private readonly customerLogCallRepository: CustomerLogCallRepository,
    private readonly httpService: HttpService,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}
  async createCustomerInvoiceExtend(
    customerId: string,
    subscriptionId: number,
  ): Promise<any> {
    const subscription =
      await this.subscriptionRepository.findSubscriptionWithRelation(
        subscriptionId,
      );

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }
    const invoiceDate = new Date();
    const month = invoiceDate.getMonth();
    const year = invoiceDate.getFullYear();

    const customer = subscription.customer;
    const service = subscription.service;

    const invoiceNum = await this.customerInvoiceRepository.getNewInvoiceNum();
    const customerInvoice = new CustomerInvoice();
    customerInvoice.id = invoiceNum;
    customerInvoice.customerId = customerId;
    customerInvoice.CustBalance = customer.CustBalance ?? null;
    customerInvoice.CustTotSubsFee = +subscription.Subscription;

    const realPPN = this.getRealPPN(+subscription.PPN ?? 0);
    const iTotal = this.getRealTotal(+subscription.Subscription, realPPN);
    const iCharge = iTotal;
    const iCurrentCharge = -iCharge;
    const iCurrentBalance = -iCurrentCharge;

    customerInvoice.PPN = customer.CustPPn;
    customerInvoice.TotalCharge = iTotal;
    customerInvoice.CurrentCharge = iCurrentCharge;
    customerInvoice.CurBalance = iCurrentBalance;
    customerInvoice.InvoiceDate = invoiceDate;
    customerInvoice.InvoiceExpDate = this.getNewDueDate(service, invoiceDate);
    customerInvoice.InvoiceStatus = INVOICE_STATUS_TAGIH;
    customerInvoice.InvoicePaidDate = INVOICE_PAID_DATE_DEFAULT;
    customerInvoice.UsagePeriod = `${('0' + month).slice(-2)}-${year}`;
    customerInvoice.subscriptionId = subscription.id;
    customerInvoice.serviceId = subscription.ServiceId;
    customerInvoice.ServiceIdFor = subscription.ServiceId;
    customerInvoice.Discount = subscription.discount;
    const groupCabang = this.getGroupCabang(customer.BranchId);
    const freeColumn = this.getChargeColumn(groupCabang, CHARGE_TYPE_FREE);
    const addColumn = this.getChargeColumn(groupCabang, CHARGE_TYPE_ADD);
    customerInvoice.Akses = service[freeColumn] ?? 0;
    customerInvoice.AddCharge = service[addColumn] ?? 0;
    customerInvoice.Status = subscription.CustStatus;
    customerInvoice.CustAccName = subscription.CustAccName;
    customerInvoice.Gabung = subscription.Gabung;
    customerInvoice.Tampil = subscription.Tampil;
    customerInvoice.Opsi = subscription.Opsi;
    customerInvoice.Urut = URUT_DEFAULT;
    customerInvoice.Date = invoiceDate;
    customerInvoice.ServiceGroup = service.ServiceGroup;
    customerInvoice.AddEmail = subscription.AddEmail;
    customerInvoice.InvoiceType = parseInt(subscription.InvoiceType);
    customerInvoice.InvoicePeriod = subscription.InvoicePeriod;
    customerInvoice.PeriodType = PERIODE_TYPE_DEFAULT;
    const periodDate = `${year}-${month}-${invoiceDate.getDate()}`;
    customerInvoice.PeriodOrder =
      await this.customerInvoiceRepository.getPeriodOrder(
        customerId,
        periodDate,
      );
    customerInvoice.TaxType = customer.TaxType ? 1 : 0;
    customerInvoice.TaxNo = await this.customerInvoiceRepository.getTaxNo(
      customer.BranchId,
      periodDate,
      customerInvoice.TaxType,
    );
    customerInvoice.RekType = customer.RekType;
    const serviceGroup = service.ServiceGroup.trim().toUpperCase();
    customerInvoice.Layanan = this.getServiceDivider(
      serviceGroup,
      DIVIDER_TYPE_LAYANAN,
    );
    customerInvoice.PeriodDescription = '';
    customerInvoice.AwalPeriode = `${year}${('0' + (month + 1)).slice(-2)}`;
    const { Month } = subscription.typeMonth;
    const akhirPeriodDate = new Date(invoiceDate.setMonth(month + Month - 1));
    customerInvoice.AkhirPeriode = `${akhirPeriodDate.getFullYear()}${(
      '0' +
      (akhirPeriodDate.getMonth() + 1)
    ).slice(-2)}`;

    const transaction = this.dataSource.createQueryRunner();
    await transaction.connect();
    await transaction.startTransaction();

    try {
      await transaction.manager.save(customerInvoice);
      await this.createCustomerInvoicePdf(
        invoiceNum,
        URUT_DEFAULT,
        transaction,
      );

      await transaction.commitTransaction();
    } catch (error) {
      await transaction.rollbackTransaction();
      throw new Is5LegacyException(error);
    } finally {
      await transaction.release();
    }

    // this.syncInvoiceToMyNusa(invoiceNum, URUT_DEFAULT);
    return customerInvoice;
  }

  getChargeColumn(branchGroup: string, type: ChargeType) {
    const branch = ChargeColumn[branchGroup] ?? {};
    return branch[type] ?? null;
  }

  getServiceDivider(serviceGroup: string, type: DividerType) {
    const service = ServiceDivider[serviceGroup] ?? {};
    if (type == DIVIDER_TYPE_LAYANAN) {
      return service[type] ?? serviceGroup;
    }

    return service[type] ?? 1;
  }

  getRealPPN(ppn: number): number {
    if (ppn >= 100) {
      return ppn;
    }
    return ppn / 100;
  }

  getRealTotal(total: number, ppn: number): number {
    if (ppn < 1) {
      ppn = ppn * total;
    }
    return Math.round(total + ppn);
  }
  getGroupCabang(cabang: string): string {
    return cabang.trim().substring(0, 2);
  }

  getNewDueDate(service: Services, invoiceDate: Date) {
    if (service.ServiceGroup == SERVICE_GROUP_FO_BROADBAND_PREPAID) {
      return new Date(invoiceDate.getFullYear(), invoiceDate.getMonth(), 10);
    }
    return new Date(invoiceDate.getFullYear(), invoiceDate.getMonth() + 1, 20);
  }

  syncInvoiceToMyNusa(invoiceNum: number, urut: number): Promise<any> {
    const myNusaApiKey = process.env.MY_NUSA_API_KEY ?? '';
    const myNusaChatAttachment = process.env.MY_NUSA_CHAT_ATTACHMENT ?? '';
    const myNusaUrl = `${myNusaChatAttachment}/is/sync/invoice/${invoiceNum}/${urut}/0?code=${myNusaApiKey}`;
    return this.httpService.axiosRef(myNusaUrl);
  }

  async createCustomerInvoicePdf(
    invoiceNum: number,
    urut: number,
    transaction: QueryRunner,
  ): Promise<CustomerInvoicePDF> {
    const params = {
      invoiceNum: invoiceNum,
      urut: urut,
      proformaInvoice: 0,
      needSignature: 0,
      showDueDate: 1,
    };

    const customerInvoicePdf = new CustomerInvoicePDF();
    customerInvoicePdf.hash = this.createHash();
    customerInvoicePdf.source = 'getInvoiceDataPerService';
    customerInvoicePdf.params = JSON.stringify(params);
    customerInvoicePdf.insertBy = 'SYSTEM';
    customerInvoicePdf.insertTime = new Date();

    await transaction.manager.save(customerInvoicePdf);
    return customerInvoicePdf;
  }

  createHash(): string {
    let hash = '';
    const str = '0123456789abcdefghijklmnopqrstuvwxyz';
    for (let i = 10; i > 0; --i) {
      hash += str[Math.floor(Math.random() * str.length)];
    }
    return hash;
  }

  async createFollowUpServiceLog(
    customerConfirmationDto: CustomerConfirmationDto,
  ): Promise<void> {
    const { customerServiceId, period, confirmation } = customerConfirmationDto;

    const year = period.getFullYear();
    const month = ('0' + (period.getMonth() + 1)).slice(-2);
    const date = new Date();

    const followUpServiceLog = this.followUpServiceLogRepository.create({
      year: year.toString(),
      month: month,
      customerServiceId: customerServiceId,
      confirmationTypeId: CONFIRMATION_TIPE_PERPANJANG,
      insertBy: EMPLOYEE_ID_SYSTEM,
      insertTime: date,
    });

    if (confirmation) {
      await this.followUpServiceLogRepository.save(followUpServiceLog);
    } else {
      followUpServiceLog.confirmationTypeId = CONFIRMATION_TIPE_CLOSE;
      await this.followUpServiceLogRepository.save(followUpServiceLog);
    }
  }

  async createCustomerLogCall(
    customerConfirmationDto: CustomerConfirmationDto,
  ): Promise<void> {
    const { customerId, confirmation, reason } = customerConfirmationDto;
    const date = new Date();

    const customerLogCall = this.customerLogCallRepository.create({
      employeeId: EMPLOYEE_ID_SYSTEM,
      subject: SUBJECT_CUSTOMER_PERPANJANG,
      status: STATUS_DONE,
      customerId: customerId,
      posted: date,
      via: VIA_CALL_OUT,
    });

    if (confirmation) {
      await this.customerLogCallRepository.save(customerLogCall);
    } else {
      customerLogCall.subject = reason;
      await this.customerLogCallRepository.save(customerLogCall);
    }
  }
}

export const SERVICE_GROUP_FO_BROADBAND_PREPAID = 'FBP';
export const SERVICE_GROUP_WIRELESS_BROADBAND = 'VB';
export const SERVICE_GROUP_CBROADBAND = 'CB';
export const SERVICE_GROUP_DIAL_UP = 'DU';
