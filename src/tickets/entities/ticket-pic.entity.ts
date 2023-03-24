import { Employee } from 'src/employees/employee.entity';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Ticket } from './ticket.entity';
@Entity({ name: 'TtsPIC', synchronize: false })
export class TicketPic extends BaseEntity {
  @PrimaryColumn({ name: 'TtsId' })
  ticketId: number;

  @Column({ name: 'EmpId' })
  employeeId: string;

  @Column({ name: 'AssignedNo' })
  assignedNo: number;

  @OneToOne(() => Employee, (emp) => emp.tickets)
  employees: Employee;
}
