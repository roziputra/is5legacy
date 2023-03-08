import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TicketPic } from '../entities/ticket-pic.entity';
import { TICKET_STATUS_CLOSED } from '../entities/ticket.entity';
import { Services } from 'src/services/entities/service.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Subscription } from 'src/customers/entities/subscriber.entity';
import { Employee } from 'src/employees/employee.entity';

@Injectable()
export class TicketPicRepository extends Repository<TicketPic> {
  constructor(private dataSource: DataSource) {
    super(TicketPic, dataSource.createEntityManager());
  }

  findEnginerTickets(EngineerId: string): Promise<any> {
    return this.createQueryBuilder('tp')
      .select([
        't.TtsId ticket_id',
        'c.CustId customer_id',
        'c.CustName customer_name',
        'cs.CustServId customer_service_id',
        'cs.CustAccName customer_acc_name',
        'cs.installation_address address',
        's.ServiceId service_id',
        's.ServiceType service_type',
        'sales.EmpId sales_id',
      ])
      .addSelect('concat(sales.EmpFName, " ", sales.EmpLName)', 'sales_name')
      .leftJoin(
        'Tts',
        't',
        't.TtsId = tp.ticketId and t.AssignedNo = tp.assignedNo',
      )
      .leftJoin(Customer, 'c', 'c.CustId = t.CustId')
      .leftJoin(Subscription, 'cs', 'cs.id = t.CustServId')
      .leftJoin(Services, 's', 's.id = cs.ServiceId')
      .leftJoin(Employee, 'sales', 'sales.EmpId = c.SalesId')
      .where('tp.EmpId = :empId', { empId: EngineerId })
      .andWhere('t.Status != :status', { status: TICKET_STATUS_CLOSED })
      .getRawMany();
  }
}
