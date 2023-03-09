import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CustomerLogCall } from '../entities/customer-log-call.entity';

@Injectable()
export class CustomerLogCallRepository extends Repository<CustomerLogCall> {
  constructor(private dataSource: DataSource) {
    super(CustomerLogCall, dataSource.createEntityManager());
  }
}
