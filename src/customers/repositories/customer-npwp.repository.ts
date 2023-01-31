import { Injectable } from '@nestjs/common';
import { NPWPCustomer } from '../entities/customer-npwp.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CustomerNpwpRepository extends Repository<NPWPCustomer> {
  constructor(private dataSource: DataSource) {
    super(NPWPCustomer, dataSource.createEntityManager());
  }
}

export const DEFAULT_SELECTED_NPWP_CUSTOMER = true;
