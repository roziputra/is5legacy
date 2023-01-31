import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Subscription } from '../entities/subscriber.entity';
import { InvoiceTypeMonthRepository } from './invoice-type-month.repository';

@Injectable()
export class CustomerSubscriptionRepository extends Repository<Subscription> {
  constructor(
    private dataSource: DataSource,
    private invoiceTypeMonth: InvoiceTypeMonthRepository,
  ) {
    super(Subscription, dataSource.createEntityManager());
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
