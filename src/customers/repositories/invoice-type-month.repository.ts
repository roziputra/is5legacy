import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InvoiceTypeMonth } from '../entities/invoice-type-month.entity';

@Injectable()
export class InvoiceTypeMonthRepository extends Repository<InvoiceTypeMonth> {
  constructor(private dataSource: DataSource) {
    super(InvoiceTypeMonth, dataSource.createEntityManager());
  }

  async getInvoiceTypeMonth(packageTop): Promise<InvoiceTypeMonth> {
    return await this.createQueryBuilder('itm')
      .select('itm.InvoiceType InvoiceType')
      .where('itm.Month = :month', { month: packageTop })
      .getRawOne();
  }
}
