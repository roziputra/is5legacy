import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'CustomerLogCall', synchronize: false })
export class CustomerLogCall extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'LogCallId' })
  id: string;

  @Column({ name: 'EmpId' })
  employeeId: string;

  @Column({ name: 'Subject' })
  subject: string;

  @Column({ name: 'Status' })
  status: string;

  @Column({ name: 'ContactPerson' })
  contactPerson: string;

  @Column({ name: 'CustId' })
  customerId: string;

  @Column({ name: 'Notes' })
  notes: string;

  @Column({ name: 'Posted' })
  posted: Date;

  @Column()
  tapiCallId: number;

  @Column()
  via: ViaCall;
}

export type ViaCall = typeof VIA_CALL_OUT | typeof VIA_CALL_IN;
export const VIA_CALL_OUT = 'Call Out';
export const VIA_CALL_IN = 'Call In';
export const STATUS_DONE = 'done';
export const SUBJECT_CUSTOMER_PERPANJANG =
  'customer setuju lakukan perpanjangan service';
