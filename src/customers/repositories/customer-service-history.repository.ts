import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CustomerServicesHistoryNew } from '../entities/customer-service-history-new.entity';
import { Subscription } from '../entities/subscriber.entity';
import { NewCustomerInitValue } from '../interfaces/new-customer.interface';

@Injectable()
export class CustomerServiceHistoryRepository extends Repository<CustomerServicesHistoryNew> {
  constructor(private dataSource: DataSource) {
    super(CustomerServicesHistoryNew, dataSource.createEntityManager());
  }

  assignCustomerServiceHistoryNew(
    newCustomerValue: NewCustomerInitValue,
    customerService: Subscription,
  ): CustomerServicesHistoryNew {
    const customerServiceHistoryNew = new CustomerServicesHistoryNew();
    customerServiceHistoryNew.cust_serv_id = customerService.ServiceId;
    customerServiceHistoryNew.emp_id = newCustomerValue.approvalEmpId;
    customerServiceHistoryNew.insert_time = new Date();
    customerServiceHistoryNew.description = SERVICE_DEFAULT_HISTORY_DESCRIPTION;

    return customerServiceHistoryNew;
  }
}

export const SERVICE_DEFAULT_HISTORY_DESCRIPTION = 'Registered';
