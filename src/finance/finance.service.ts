import { Injectable } from '@nestjs/common';
import { GetDepreciationFilterDto } from './dto/get-depreciation-filter.dto';
import { StockInvoiceRepository } from './repositories/stock-invoice-repository';

@Injectable()
export class FinanceService {
  constructor(private stockInvoiceRepository: StockInvoiceRepository) {}
  async getDepreciationData(
    getDepreciationFilterDto: GetDepreciationFilterDto,
  ) {
    const { branchId, period } = getDepreciationFilterDto;
    const month = new Date(period.fromDate).getMonth();
    return this.stockInvoiceRepository
      .getDepreciationStock(period.fromDate, period.toDate, branchId)
      .then((data) => {
        return data
          .map((stock) => {
            const amount = Math.round((stock.Unit - stock.Free) * stock.Price);
            if (amount > 0) {
              const depreciation = Math.round(
                ((amount * DEPRECIATION_PERSENTAGE) / 100) * (1 - month / 12),
              );
              stock.amount = amount;
              stock.depreciation = depreciation;
              stock.books = amount - depreciation;
              return stock;
            }
          })
          .filter((n) => n);
      });
  }

  async getTotalDepreciation(
    getDepreciationFilterDto: GetDepreciationFilterDto,
  ) {
    const { branchId, period } = getDepreciationFilterDto;
    const month = new Date(period.fromDate).getMonth();
    return this.stockInvoiceRepository
      .getDepreciationStock(period.fromDate, period.toDate, branchId)
      .then((data) => {
        return data.reduce((data, stock, index) => {
          const total = data[stock.Status]?.total ?? 0;
          const totalDepreciation = data[stock.Status]?.depreciation ?? 0;
          const totalBook = data[stock.Status]?.book ?? 0;

          const amount = (stock.Unit - stock.Free) * stock.Price;
          const depreciation = Math.round(
            ((amount * DEPRECIATION_PERSENTAGE) / 100) * (1 - month / 12),
          );

          data[stock.Status] = {
            total: total + amount,
            depreciation: totalDepreciation + depreciation,
            book: totalBook + (amount - depreciation),
          };

          return data;
        }, {});
      });
  }
  async getTotalDepreciationStatus(
    getDepreciationFilterDto: GetDepreciationFilterDto,
  ) {
    const { branchId, period } = getDepreciationFilterDto;
    const month = new Date(period.fromDate).getMonth();
    return await this.stockInvoiceRepository
      .getDepreciationStockStatus(period.fromDate, period.toDate, branchId)
      .then((data) => {
        return data.reduce((data, item) => {
          const amount = Math.round(item.Price);
          const depreciation = Math.round(
            ((amount * DEPRECIATION_PERSENTAGE) / 100) * (1 - month / 12),
          );
          data[item.Status] = {
            total: amount,
            depreciation: depreciation,
            books: amount - depreciation,
          };
          return data;
        }, {});
      });
  }
}

export const DEPRECIATION_PERSENTAGE = 50;
