import { Expose } from 'class-transformer';

export class CustomerServiceApiResource {
  @Expose()
  id: string;

  @Expose({ name: 'account_name' })
  CustAccName: string;

  @Expose()
  instalation_address: string;
}
