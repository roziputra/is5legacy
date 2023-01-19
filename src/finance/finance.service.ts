import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GetDepreciationFilterDto } from './dto/get-depreciation-filter.dto';
import { StockInvoiceRepository } from './repositories/stock-invoice-repository';
import { readFileSync } from 'fs';
import { join } from 'path';
import { DataSource } from 'typeorm';
import {
  DEPRECIATION_PERSENTAGE,
  GeneralJournalRepository,
} from './repositories/general-journal-repository';

@Injectable()
export class FinanceService {
  constructor(
    private generalJornalRepository: GeneralJournalRepository,
    private stockInvoiceRepository: StockInvoiceRepository,
    private dataSource: DataSource,
  ) {}
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

  async addDepreciationToGeneralJournal(branchId: string, period) {
    const transaction = this.dataSource.createQueryRunner();
    await transaction.connect();
    await transaction.startTransaction();
    try {
      const totalDepreciation = await this.getTotalDepreciationPerMonth(
        branchId,
        period,
      );

      await this.generalJornalRepository.addDepreciationToGeneralJournal(
        transaction,
        totalDepreciation,
        branchId,
        period,
      );

      await transaction.commitTransaction();
    } catch (error) {
      await transaction.rollbackTransaction();
      throw new InternalServerErrorException('Failed to add depreciation');
    } finally {
      await transaction.release();
    }
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

  async getTotalDepreciationPerMonth(branchId: string, period) {
    const month = new Date(period.fromDate).getMonth();
    const year = period.fromDate.substring(0, 4);
    const depreciationUntil = await this.getMonthlyDepreciationUntil(year);
    return await this.stockInvoiceRepository
      .getDepreciationStockStatus(period.fromDate, period.toDate, branchId)
      .then((data) => {
        return data.reduce((total, item) => {
          const amount = Math.round(item.Price);
          const depreciation =
            amount * DEPRECIATION_PERSENTAGE * (1 - month / 12); // rumus penyusutan
          const depreciationPerMonth = Math.round(depreciation / 12); // div 12 month
          total = total + depreciationPerMonth + depreciationUntil[item.Status];
          return total;
        }, 0);
      });
  }

  async getMonthlyDepreciationUntil(year) {
    const jsonString = await readFileSync(
      join(process.cwd(), 'src/finance', './depreciation-store.json'),
      'utf-8',
    );

    const depreciationPerYear = JSON.parse(jsonString);

    return depreciationPerYear[year];
  }
}
