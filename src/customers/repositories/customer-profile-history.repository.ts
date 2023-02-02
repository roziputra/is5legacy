import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CustomerProfileHistory } from '../entities/customer-profile-history.entity';

@Injectable()
export class CustomerProfileHistoryRepository extends Repository<CustomerProfileHistory> {
  constructor(private dataSource: DataSource) {
    super(CustomerProfileHistory, dataSource.createEntityManager());
  }
}
