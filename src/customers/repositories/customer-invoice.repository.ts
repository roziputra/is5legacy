import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CustomerInvoice } from '../entities/customer-invoice.entity';

@Injectable()
export class CustomerInvoiceRepository extends Repository<CustomerInvoice> {
  constructor(private dataSource: DataSource) {
    super(CustomerInvoice, dataSource.manager);
  }

  getNewInvoiceNum(): Promise<number> {
    return this.createQueryBuilder('inv')
      .select('max(inv.InvoiceNum) InvoiceNum')
      .getRawOne()
      .then((data) => {
        if (data) {
          return data.InvoiceNum + 1;
        }
        return 1;
      });
  }

  getPeriodOrder(customerId: string, periodDate: string): Promise<number> {
    return this.createQueryBuilder('inv')
      .select('PeriodOrder')
      .where('PeriodType = :periodType', { periodType: PERIODE_TYPE_DEFAULT })
      .where('substr(Date,1,7) = :periodDate', {
        periodDate: periodDate.substring(0, 7),
      })
      .where('CustId like :branch', {
        branch: `${customerId.substring(0, 3)}%`,
      })
      .orderBy('PeriodOrder', 'DESC')
      .limit(1)
      .getRawOne()
      .then((data) => {
        if (data) {
          return data.PeriodOrder + 1;
        }
        return 1;
      });
  }

  getTaxNo(branch: string, taxDate: string, taxType: number): Promise<number> {
    return this.createQueryBuilder('inv')
      .select('max(inv.TaxNo) TaxNo')
      .leftJoin('Customer', 'c', 'c.CustId = inv.CustId')
      .where('c.BranchId = :branch', { branch: branch })
      .where('date_format(inv.InvoiceDate, "%Y-%m") = :taxDate', {
        taxDate: taxDate.substring(0, 7),
      })
      .where('inv.PeriodType = :periodType', {
        periodType: PERIODE_TYPE_DEFAULT,
      })
      .where('inv.TaxType = :taxType', { taxType: taxType })
      .getRawOne()
      .then((data) => {
        if (data) {
          return data.TaxNo + 1;
        }
        return 1;
      });
  }
}

export const INVOICE_STATUS_TAGIH = 'Tagih';
export const INVOICE_PAID_DATE_DEFAULT = '0000-00-00';
export const URUT_DEFAULT = 1;
export const PERIODE_TYPE_DEFAULT = 1;
