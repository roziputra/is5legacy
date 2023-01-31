import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CustomerFix } from '../entities/customer-fix.entity';

@Injectable()
export class CustomerFixRepository extends Repository<CustomerFix> {
  constructor(private dataSource: DataSource) {
    super(CustomerFix, dataSource.createEntityManager());
  }
}
