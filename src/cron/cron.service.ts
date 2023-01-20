import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GeneralTicketExpiredDocService } from './general-ticket-expired-doc.service';
import { DepreciationJournalService } from './depreciation-journal.service';

@Injectable()
export class CronService {
  constructor(
    private generalTicketExpiredDocService: GeneralTicketExpiredDocService,
    private depreciationJournalService: DepreciationJournalService,
  ) {}
  @Cron('0 20 * * * *')
  generalTicketExpiredDoc() {
    this.generalTicketExpiredDocService.runCron();
  }

  @Cron('* 2 1 * * *')
  depreciationJournal() {
    this.depreciationJournalService.runCron();
  }

  static isCronStarted() {
    const cronStart = process.env.CRON_START || 'off';
    if (cronStart == 'on') {
      return true;
    }
    return false;
  }
}
