import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'TtsPIC', synchronize: false })
export class TicketPic extends BaseEntity {
  @PrimaryColumn({ name: 'TtsId' })
  ticketId: number;

  @Column({ name: 'EmpId' })
  employeeId: string;

  @Column({ name: 'AssignedNo' })
  assignedNo: number;
}
