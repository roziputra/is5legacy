import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CustomerInvoiceSignature } from '../entities/customer-invoice-signature.entity';

@Injectable()
export class CustomerInvoiceSignatureRepository extends Repository<CustomerInvoiceSignature> {
  constructor(private dataSource: DataSource) {
    super(CustomerInvoiceSignature, dataSource.createEntityManager());
  }
}

export const CUSTOMER_DEFAULT_USE_SIGNATURE_ID = '020';
export const CUSTOMER_DEFAULT_MARK_SIGNATURE = '0';
