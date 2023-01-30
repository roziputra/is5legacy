import { Injectable } from '@nestjs/common';
import { NPWPCustomer } from '../entities/customer-npwp.entity';
import { DataSource, Repository } from 'typeorm';
import { NewCustomerInitValue } from '../interfaces/new-customer.interface';

@Injectable()
export class CustomerNpwpRepository extends Repository<NPWPCustomer> {
  constructor(private dataSource: DataSource) {
    super(NPWPCustomer, dataSource.createEntityManager());
  }

  assignNpwpCust(newCustomerValue: NewCustomerInitValue): NPWPCustomer {
    const npwpCust = new NPWPCustomer();
    npwpCust.Name = newCustomerValue.fullName.toUpperCase();
    npwpCust.Address = newCustomerValue.identityAddress.toUpperCase();
    npwpCust.NPWP = newCustomerValue.npwpNumber;
    npwpCust.CustId = newCustomerValue.custId;
    npwpCust.Selected = DEFAULT_SELECTED_NPWP_CUSTOMER;

    return npwpCust;
  }
}

export const DEFAULT_SELECTED_NPWP_CUSTOMER = true;
