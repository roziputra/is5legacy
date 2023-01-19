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
      .andWhere('a.Status IN (:peminjaman, :inventaris)', {
        peminjaman: STATUS_PEMINJAMAN,
        inventaris: STATUS_INVENTARIS,
      })
      .andWhere('a.Reverse = :reverse', { reverse: NOT_REVERSE })
      .andWhere('ifnull(RNo, 0) = :RNo', {
        RNo: NO_RNo,
      })
      .andWhere('m.Type = :type', { type: TYPE_PERALATAN })
      .andWhere('e.Flag = :flag', { flag: INVOICE_APPROVED })
      .andWhere('c.Unit > 0')
      .andWhere('c.Price != 0')
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
      .andWhere('a.Status IN (:peminjaman, :inventaris)', {
        peminjaman: STATUS_PEMINJAMAN,
        inventaris: STATUS_INVENTARIS,
      })
      .andWhere('a.Reverse = :reverse', { reverse: NOT_REVERSE })
      .andWhere('ifnull(RNo, 0) = :RNo', {
        RNo: NO_RNo,
      })
      .andWhere('m.Type = :type', { type: TYPE_PERALATAN })
      .andWhere('e.Flag = :flag', { flag: INVOICE_APPROVED })
      .andWhere('c.Unit > 0')
      .andWhere('c.Price != 0')
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

export const STATUS_INVENTARIS = 'IV';
export const STATUS_PEMINJAMAN = 'PM';
export const NOT_REVERSE = 0;
export const NO_RNo = 0;
export const TYPE_PERALATAN = 1;
export const INVOICE_APPROVED = 1;
