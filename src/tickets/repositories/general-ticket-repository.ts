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

export const REMINDER_EXPIRED_DOC_SUBJECT = 'Reminder Expired Document';
export const DEFAULT_PID = 0;
export const SYSTEM = 'SYSTEM';
export const PRIORITY_MEDIUM = 1;
export const STATUS_OPEN = 11;
export const PRIVATE_FALSE = 0;
export const DEFAULT_PROGRESS = 0;
export const DEFAULT_COST = 0;
export const DEFAULT_ASSIGN_NO = 1;
export const DEFAULT_SOURCE_ID = 3;
export const TTS_TYPE_SURVEY = 5;
