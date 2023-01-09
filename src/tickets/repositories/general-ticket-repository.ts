import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GeneralTicket } from '../entities/general-ticket.entity';

@Injectable()
export class GeneralTicketRepository extends Repository<GeneralTicket> {
  constructor(private dataSource: DataSource) {
    super(GeneralTicket, dataSource.createEntityManager());
  }

  checkFirstReminderExpiredDocumentTicket() {
    return GeneralTicket.createQueryBuilder('t')
      .where('t.subject = :subject', { subject: 'Reminder Expired Document' })
      .getCount();
  }
}
