import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CustomerVerifiedEmail } from '../entities/customer-verified-email.entity';

@Injectable()
export class CustomerVerifiedEmailRepository extends Repository<CustomerVerifiedEmail> {
  constructor(private dataSource: DataSource) {
    super(CustomerVerifiedEmail, dataSource.createEntityManager());
  }
}

export const DEFAULT_EMAIL_TYPE_1 = 'billing';
export const DEFAULT_EMAIL_TYPE_2 = 'technical';
export const DEFAULT_VERIFIED_STATUS = '0';
