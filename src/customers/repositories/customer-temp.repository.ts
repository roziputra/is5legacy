import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CustomerTemp } from '../entities/customer-temp.entity';

@Injectable()
export class CustomerTempRepository extends Repository<CustomerTemp> {
  constructor(private dataSource: DataSource) {
    super(CustomerTemp, dataSource.createEntityManager());
  }
}
