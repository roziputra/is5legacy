import { Expose } from 'class-transformer';

export class CustomerApiResource {
  @Expose({ name: 'id' })
  CustId: string;

  @Expose({ name: 'customer_name' })
  CustName: string;

  @Expose({ name: 'customer_company' })
  CustCompany: string;
}
