import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Tts', synchronize: false })
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'TtsId' })
  id: number;

  @Column({ name: 'EmpId' })
  employeeId: string;

  @Column({ name: 'CustServId' })
  customerServiceId: number;

  @Column({ name: 'CustId' })
  CustomerId: string;

  @Column({ name: 'AssignedNo' })
  assignedNo: number;

  @Column({ name: 'Status' })
  status: string;

  @Column({ name: 'LockedBy' })
  lockedBy: string;

  @Column({ name: 'VisitTime', type: 'datetime' })
  visitTime: Date;
}

export const TICKET_STATUS_CLOSED = 'Closed';
