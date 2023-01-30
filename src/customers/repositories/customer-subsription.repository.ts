import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Subscription } from '../entities/subscriber.entity';
import { NewCustomerInitValue } from '../interfaces/new-customer.interface';
import { InvoiceTypeMonthRepository } from './invoice-type-month.repository';

@Injectable()
export class CustomerSubscriptionRepository extends Repository<Subscription> {
  constructor(
    private dataSource: DataSource,
    private invoiceTypeMonth: InvoiceTypeMonthRepository,
  ) {
    super(Subscription, dataSource.createEntityManager());
  }

  async assignSubscription(
    newCustomerValue: NewCustomerInitValue,
    accName: string,
  ): Promise<Subscription> {
    const Services = new Subscription();
    Services.CustId = newCustomerValue.custId;
    Services.ServiceId = newCustomerValue.packageCode;
    Services.ServiceType = newCustomerValue.packageName;
    Services.EmpId = newCustomerValue.approvalEmpId;
    Services.PayId = SERVICE_PAY_ID_METHOD; // PayId adalah sistem metode pembayaran default idnya = '001' dan valuenya = 'Transfer'
    Services.CustStatus = SERVICE_DEFAULT_STATUS;
    Services.CustRegDate = new Date();
    Services.CustActivationDate = new Date();
    Services.CustUpdateDate = new Date();
    Services.CustBlockDate = new Date();
    Services.CustBlockFrom = SERVICE_DEFAULT_BLOCK_FROM;
    Services.CustAccName = accName;
    Services.EmpIdEdit = newCustomerValue.approvalEmpId;
    Services.Opsi = SERVICE_DEFAULT_OPTION;
    Services.StartTrial = new Date();
    Services.EndTrial = new Date();
    Services.StatusPerangkat = SERVICE_DEFAULT_DEVICE_STATUS;
    Services.Gabung = SERVICE_DEFAULT_JOIN_STATUS;
    Services.Tampil = SERVICE_DEFAULT_SHOW_STATUS;
    Services.TglHarga = new Date();
    Services.Subscription = newCustomerValue.packagePrice;
    Services.InvoiceType = (
      await this.invoiceTypeMonth.getInvoiceTypeMonth(
        newCustomerValue.packageTop,
      )
    ).InvoiceType.toString();
    Services.InvoicePeriod = `${
      ('0' + (new Date().getMonth() + 1)).slice(-2) +
      new Date().getFullYear().toString().slice(-2)
    }`;
    Services.InvoiceDate1 = SERVICE_DEFAULT_INVOICE_DATE_STATUS;
    Services.AddEmailCharge = SERVICE_DEFAULT_ADD_EMAIL_CHARGE_STATUS;
    Services.AccessLog = SERVICE_DEFAULT_ACCESS_LOG_STATUS;
    Services.Description = newCustomerValue.extendNote;
    Services.installation_address = newCustomerValue.installationAddress;
    Services.ContractUntil = new Date();
    Services.Type = SERVICE_DEFAULT_INSTALLATION_TYPE;
    Services.promo_id = newCustomerValue.promoId;
    Services.BlockTypeId = SERVICE_DEFAULT_BLOCK_TYPE_STATUS;
    Services.BlockTypeDate = SERVICE_DEFAULT_BLOCK_TYPE_DATE;
    Services.CustBlockFromMenu = SERVICE_DEFAULT_CUSTOMER_BLOCK_FROM_MENU;
    Services.IPServer = SERVICE_DEFAULT_IP_SERVER;
    Services.PPN = newCustomerValue.ppn;

    return Services;
  }
}

export const SERVICE_PAY_ID_METHOD = '001';
export const SERVICE_DEFAULT_STATUS = 'BL';
export const SERVICE_DEFAULT_BLOCK_FROM = true;
export const SERVICE_DEFAULT_OPTION = true;
export const SERVICE_DEFAULT_DEVICE_STATUS = 'PM';
export const SERVICE_DEFAULT_JOIN_STATUS = false;
export const SERVICE_DEFAULT_SHOW_STATUS = true;
export const SERVICE_DEFAULT_INVOICE_DATE_STATUS = true;
export const SERVICE_DEFAULT_ADD_EMAIL_CHARGE_STATUS = false;
export const SERVICE_DEFAULT_ACCESS_LOG_STATUS = false;
export const SERVICE_DEFAULT_INSTALLATION_TYPE = null;
export const SERVICE_DEFAULT_BLOCK_TYPE_STATUS = true;
export const SERVICE_DEFAULT_BLOCK_TYPE_DATE = '23';
export const SERVICE_DEFAULT_CUSTOMER_BLOCK_FROM_MENU = 'edit_subs';
export const SERVICE_DEFAULT_IP_SERVER = '000.000.000.000';
