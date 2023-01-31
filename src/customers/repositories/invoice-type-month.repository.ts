import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InvoiceTypeMonth } from '../entities/invoice-type-month.entity';

@Injectable()
export class InvoiceTypeMonthRepository extends Repository<InvoiceTypeMonth> {
  constructor(private dataSource: DataSource) {
    super(InvoiceTypeMonth, dataSource.createEntityManager());
  }
}
