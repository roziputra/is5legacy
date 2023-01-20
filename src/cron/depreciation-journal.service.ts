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
    const month = d.getMonth() + 1;
    const lastDate = new Date(d.getFullYear(), month, 0);
    const year = lastDate.getFullYear();

    const period = {
      fromDate: `${year}-01-01`,
      toDate: `${year}-${('0' + month).slice(-2)}-${lastDate.getDate()}`,
    };

    const branches = process.env.DEPRECIATION_BRANCHES || false;

    if (!branches) {
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
