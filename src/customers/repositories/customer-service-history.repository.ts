import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CustomerServicesHistoryNew } from '../entities/customer-service-history-new.entity';

@Injectable()
export class CustomerServiceHistoryRepository extends Repository<CustomerServicesHistoryNew> {
  constructor(private dataSource: DataSource) {
    super(CustomerServicesHistoryNew, dataSource.createEntityManager());
  }
}

export const SERVICE_DEFAULT_HISTORY_DESCRIPTION = 'Registered';
