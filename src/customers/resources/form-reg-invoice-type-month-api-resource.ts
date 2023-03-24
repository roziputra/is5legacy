import { Expose, Type } from 'class-transformer';
import { FormRegSubscriptionApiResource } from './form-reg-subscription-api-resource';

export class FormRegInvoiceTypeMonthApiResource {
  @Expose({ name: 'month' })
  Month: string;
}
