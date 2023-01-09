import { Controller, Get, Query } from '@nestjs/common';
import { GeneralTicketExpiredDocService } from './general-ticket-expired-doc.service';

@Controller('cron')
export class CronController {
  constructor(private expiredIsoDocCron: GeneralTicketExpiredDocService) {}
  @Get('expired-iso-doc')
  async getExpiredIsoDoc(@Query('date') date: string) {
    let dateCron = new Date();
    if (date != undefined) {
      const [y, m, d] = date.split('-', 3).map((i) => parseInt(i.trim()));
      dateCron = new Date(
        y,
        m - 1,
        d,
        dateCron.getHours(),
        dateCron.getMinutes(),
        dateCron.getSeconds(),
      );
    }

    await this.expiredIsoDocCron.handleCron(dateCron);
    console.log('cron completed ' + dateCron);
  }
}
