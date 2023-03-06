import { Injectable } from '@nestjs/common';
import { FinanceService } from 'src/finance/finance.service';
import { CronService } from './cron.service';

@Injectable()
export class DepreciationJournalService {
  constructor(private financeService: FinanceService) {}
  async runCron() {
    if (!CronService.isCronStarted()) {
      return false;
    }

    const d = new Date();
    const lastDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const year = lastDate.getFullYear();
    const month = lastDate.getMonth();
    const date = lastDate.getDate();

    const period = {
      fromDate: `${year}-01-01`,
      toDate: `${year}-${('0' + (month + 1)).slice(-2)}-${date}`,
    };

    const branches = process.env.DEPRECIATION_BRANCHES || false;

    if (!branches) {
      console.info('no branches');
      return;
    }

    branches.split(',').map(async (branch) => {
      await this.financeService.addDepreciationToGeneralJournal(
        branch.trim(),
        period,
      );
    });
  }
}
