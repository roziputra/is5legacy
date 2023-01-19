import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GeneralTicketExpiredDocService } from './general-ticket-expired-doc.service';

@Injectable()
export class CronService {
  constructor(
    private generalTicketExpiredDocService: GeneralTicketExpiredDocService,
  ) {}
  @Cron('0 20 * * * *')
  async generalTicketExpiredDoc() {
    this.generalTicketExpiredDocService.runCron();
  }

  static isCronStarted() {
    const cronStart = process.env.CRON_START || 'off';
    if (cronStart == 'off') {
      return false;
    }
    return true;
  }
}
