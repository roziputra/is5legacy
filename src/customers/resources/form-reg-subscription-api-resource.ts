import { Exclude, Expose, Type } from 'class-transformer';
import { FormRegInvoiceTypeMonthApiResource } from './form-reg-invoice-type-month-api-resource';

export class FormRegSubscriptionApiResource {
  @Expose({name: 'package_code'})
  ServiceId: number;

  @Expose({ name: 'package_price' })
  Subscription: string;

  @Exclude()
  @Type(() => FormRegInvoiceTypeMonthApiResource)
  typeMonth: FormRegInvoiceTypeMonthApiResource;
  
  @Expose({ name: 'package_top' })
  getPackageTop(): string {
    return this.typeMonth.Month;
  }
}
