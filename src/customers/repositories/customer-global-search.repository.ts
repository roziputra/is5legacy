import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CustomerGlobalSearch } from '../entities/customer-global-search.entity';

@Injectable()
export class CustomerGlobalSearchRepository extends Repository<CustomerGlobalSearch> {
  constructor(private dataSource: DataSource) {
    super(CustomerGlobalSearch, dataSource.createEntityManager());
  }
}
