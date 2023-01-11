import { Repository } from 'typeorm';
import { StockInvoice } from '../entities/stock-invoice.entity';

export class StockInvoiceRepository extends Repository<StockInvoice> {
  getDepreciationStock(fromDate: string, toDate: string, branchId: string) {
    return StockInvoice.createQueryBuilder('c')
      .select([
        'a.CustId',
        'a.Status',
        'b.CustName CustName',
        'b.CustCompany CustCompany',
        'a.Spmb',
        'a.No',
        'c.Name',
        'c.Serial',
        'c.Unit',
        'c.Free',
        'c.Price',
        'c.UnitAmount',
        'c.COGS',
        'c.Total',
      ])
      .leftJoin('StockInvoiceHead', 'a', 'a.No = c.No')
      .leftJoin('StockInvoiceApproval', 'e', 'e.Invoice = c.No')
      .leftJoin('Customer', 'b', 'b.CustId = a.CustId')
      .leftJoin('Master', 'm', 'm.Code = c.Code and m.Branch = :branchId', {
        branchId: branchId,
      })
      .andWhere('a.Status IN ("PM", "IV")')
      .andWhere('a.Reverse = 0')
      .andWhere('m.Type = 1') // barang
      .andWhere('e.Flag = 1') // approved
      .andWhere('c.Unit > 0') // peminjaman
      .andWhere('ifnull(DisplayBranchId,branchId) = :branchId', {
        branchId: branchId,
      })
      .andWhere('a.InsertDate between :fromDate and :toDate', {
        fromDate: fromDate,
        toDate: toDate,
      })
      .orderBy('a.No')
      .orderBy('a.Status')
      .getRawMany();
  }
  getDepreciationStockStatus(
    fromDate: string,
    toDate: string,
    branchId: string,
  ) {
    return StockInvoice.createQueryBuilder('c')
      .select([
        'a.Status',
        'sum((c.Unit-c.Free)*c.Price) Price',
        'sum(c.Unit*c.UnitAmount*c.COGS) COGS',
        'sum(c.Total) Total',
      ])
      .leftJoin('StockInvoiceHead', 'a', 'a.No = c.No')
      .leftJoin('StockInvoiceApproval', 'e', 'e.Invoice = c.No')
      .leftJoin('Customer', 'b', 'b.CustId = a.CustId')
      .leftJoin('Master', 'm', 'm.Code = c.Code and m.Branch = :branchId', {
        branchId: branchId,
      })
      .andWhere('a.Status IN ("PM", "IV")')
      .andWhere('a.Reverse = 0')
      .andWhere('m.Type = 1') // barang
      .andWhere('e.Flag = 1') // approved
      .andWhere('c.Unit > 0') // peminjaman
      .andWhere('ifnull(DisplayBranchId,branchId) = :branchId', {
        branchId: branchId,
      })
      .andWhere('a.InsertDate between :fromDate and :toDate', {
        fromDate: fromDate,
        toDate: toDate,
      })
      .groupBy('a.Status')
      .orderBy('a.Status')
      .getRawMany();
  }
}
