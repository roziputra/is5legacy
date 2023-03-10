import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TtbCustomer } from '../entities/ttb-customer.entity';

@Injectable()
export class TtbCustomerRepository extends Repository<TtbCustomer> {
  constructor(private dataSource: DataSource) {
    super(TtbCustomer, dataSource.createEntityManager());
  }
}
