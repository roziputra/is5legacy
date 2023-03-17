import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'TtsUpdate', synchronize: false })
export class TicketUpdate extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'TtsUpdateId' })
  id: number;

  @Column({ name: 'TtsId' })
  ttsId: number;

  @Column({ name: 'UpdatedTime', type: 'datetime' })
  updatedTime: Date;

  @Column({ name: 'ActionStart', type: 'datetime' })
  actionStart: Date;

  @Column({ name: 'ActionBegin', type: 'datetime' })
  actionBegin: Date;

  @Column({ name: 'ActionEnd', type: 'datetime' })
  actionEnd: Date;

  @Column({ name: 'ActionStop', type: 'datetime' })
  actionStop: Date;

  @Column({ name: 'EmpId' })
  employeeId: string;

  @Column({ name: 'Action' })
  action: string;

  @Column({ name: 'Note' })
  note: string;

  @Column({ name: 'AssignedNo' })
  assignedNo: number;

  @Column({ name: 'Status' })
  status: string;

  @Column({ name: 'LockedBy' })
  lockedBy: string;

  @Column({ name: 'VisitTime', type: 'datetime', nullable: true })
  visitTime: Date;
}

export const TTS_UPDATE_ACTION = 'Update customer id dan customer service id';
export const TTS_UPDATE_EMPLOYEE_ID = 'SYSTEM';
