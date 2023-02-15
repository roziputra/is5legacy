import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CustomerInvoicePDF } from '../entities/customer-invoice-pdf.entity';

@Injectable()
export class CustomerInvoicePDFRepository extends Repository<CustomerInvoicePDF> {
  constructor(private dataSource: DataSource) {
    super(CustomerInvoicePDF, dataSource.manager);
  }
}
