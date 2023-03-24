import { Exclude, Expose, Type } from 'class-transformer';
import { FormRegSubscriptionApiResource } from './form-reg-subscription-api-resource';

export class FormRegCustomerApiResource {
  @Expose({ name: 'id' })
  CustId: string;

  @Expose({ name: 'customer_name' })
  CustName: string;

  @Expose({ name: 'customer_company' })
  CustCompany: string;

  @Expose({name: 'address'})
  getAddress(): string {
    return `${this.CustResAdd1}, ${this.CustResAdd2}, ${this.CustResCity}`;
  }

  @Expose({ name: 'list_of_service' })
  getListOfService() {
    return this.ListOfService;
  }

  @Exclude()
  CustResAdd1: string;

  @Exclude()
  CustResAdd2: string;
  
  @Exclude()
  CustResCity: string;

  @Exclude()
  @Type(() => FormRegSubscriptionApiResource)
  ListOfService: FormRegSubscriptionApiResource;
}
