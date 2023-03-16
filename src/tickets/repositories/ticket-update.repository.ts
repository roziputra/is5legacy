import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TicketUpdate } from '../entities/ticket-update.entity';
import { Ticket } from '../entities/ticket.entity';

@Injectable()
export class TicketUpdateRepository extends Repository<TicketUpdate> {
  constructor(private dataSource: DataSource) {
    super(TicketUpdate, dataSource.createEntityManager());
  }

  async insertTtsUpdate(ticketId: string, tickets: Ticket): Promise<any> {
    const newTicketUpdated = new TicketUpdate();
    newTicketUpdated.ttsId = parseInt(ticketId);
    newTicketUpdated.updatedTime = new Date();
    newTicketUpdated.actionStart = new Date();
    newTicketUpdated.actionBegin = new Date();
    newTicketUpdated.actionEnd = new Date();
    newTicketUpdated.actionStop = new Date();
    newTicketUpdated.employeeId = 'SYSTEM';
    newTicketUpdated.action = 'Update customer id dan customer service id';
    newTicketUpdated.note = '';
    newTicketUpdated.assignedNo = tickets.assignedNo;
    newTicketUpdated.status = tickets.status;
    newTicketUpdated.lockedBy = tickets.lockedBy;
    newTicketUpdated.visitTime = tickets.visitTime;
    return await this.save(newTicketUpdated);
  }
}
