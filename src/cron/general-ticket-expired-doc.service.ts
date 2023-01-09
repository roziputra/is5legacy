import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GeneralTicket } from 'src/tickets/entities/general-ticket.entity';
import { TicketPic } from 'src/tickets/entities/ticket-pic.entity';
import { TtsService } from 'src/tickets/tickets.service';

@Injectable()
export class GeneralTicketExpiredDocService {
  constructor(private ticketService: TtsService) {}
  @Cron('0 20 * * * *')
  async handleCron(date = new Date()) {
    const cronStart = process.env.CRON_START || false;
    if (cronStart == 'false') {
      return;
    }

    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const h = date.getHours();
    const i = date.getMinutes();
    const s = date.getSeconds();

    const nowDate = this.toDateFormat(date);
    const effectiveUntilDate = this.toDateFormat(
      new Date(y, m + 2, d, h, i, s),
    );
    const effectiveUntilFromDate = this.toDateFormat(
      new Date(y, m - 2, d, h, i, s),
    );
    const timeCreated = this.toDateTimeFormat(date);
    const timeExpired = this.toDateTimeFormat(new Date(y, m, d + 7, h, i, s));

    const checkFirst =
      await this.ticketService.checkFirstReminderExpiredDocumentTicket();

    let expiredIsoDoc = [];
    if (checkFirst) {
      expiredIsoDoc = await this.ticketService.getIsoDocWhenEffectiveUntil(
        effectiveUntilDate,
      );
    } else {
      expiredIsoDoc =
        await this.ticketService.getIsoDocWhenEffectiveUntilBetween(
          effectiveUntilFromDate,
          nowDate,
        );
    }

    const subject = 'Reminder Expired Document';

    for (const object of expiredIsoDoc) {
      const desc = `Document ${object.document_nam} akan expired pada tanggal ${object.effective_until}
                    <a href="/v2/general/maintained-document/detail/${object.document_id}"> Document </a>`;

      const ticket = new GeneralTicket();
      ticket.pid = 0;
      ticket.subject = subject;
      ticket.comment = desc;
      ticket.empId = 'SYSTEM';
      ticket.createdBy = 'SYSTEM';
      ticket.custId = '';
      ticket.timeCreated = timeCreated;
      ticket.timeStart = timeCreated;
      ticket.timeExpired = timeExpired;
      ticket.statusId = 11;
      ticket.progress = 0;
      ticket.priorityId = 2;
      ticket.cost = 0;
      ticket.assignNo = 1;
      ticket.sourceId = 3;
      ticket.private = 0;

      const ticketSaved = await this.ticketService.createGeneralTicket(ticket);
      console.log(ticketSaved);
      let pic = object.created_by;

      // 4 Nov 2022 ticket pic ke ramadina alihkan ke indah rayahu
      if (pic == '0201101') {
        pic = '0200934';
      }

      const ticketPic = new TicketPic();
      ticketPic.ticketId = ticketSaved.id;
      ticketPic.assignNo = 1;
      ticketPic.type = 'employee';
      ticketPic.typeId = pic;

      await this.ticketService.addTicketPic(ticketPic);
      console.log(`General ticket created #${ticketSaved.id}`);
    }
  }

  toDateTimeFormat(date: Date): string {
    return `${this.toDateFormat(date)} ${this.toTimeFormat(date)}`;
  }

  toDateFormat(date: Date): string {
    const y = date.getFullYear().toString();
    const m = (date.getMonth() + 1).toString();
    const d = date.getDate().toString();
    return `${y}-${('0' + m).slice(-2)}-${('0' + d).slice(-2)}`;
  }

  toTimeFormat(date: Date): string {
    const h = date.getHours().toString();
    const i = date.getMinutes().toString();
    const s = date.getSeconds().toString();
    return `${('0' + h).slice(-2)}:${('0' + i).slice(-2)}:${('0' + s).slice(-2)}`;
  }
}
