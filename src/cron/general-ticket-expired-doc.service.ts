import { Injectable } from '@nestjs/common';
import { TtsService } from 'src/tickets/tickets.service';
import { CronService } from './cron.service';

@Injectable()
export class GeneralTicketExpiredDocService {
  constructor(private ticketService: TtsService) {}
  async runCron() {
    if (!CronService.isCronStarted()) {
      return false;
    }

    const forwardPic = [];
    const forwardPicFrom = process.env.FORWARD_PIC_FROM || null;
    const forwardPicTo = process.env.FORWARD_PIC_TO || null;
    if (forwardPicFrom && forwardPicTo) {
      forwardPic[process.env.FORWARD_PIC_FROM] = process.env.FORWARD_PIC_TO;
    }

    this.ticketService.generateGeneralTicketExpiredDoc(new Date(), forwardPic);
  }
}
