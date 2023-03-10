import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'FollowUpServiceLog', synchronize: false })
export class FollowUpServiceLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: string;

  @Column()
  month: string;

  @Column({ name: 'custServId' })
  customerServiceId: number;

  @Column({ name: 'custId' })
  customerId: string;

  @Column()
  confirmationTypeId: ConfirmationType;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  insertBy: string;

  @Column()
  insertTime: Date;
}

export type ConfirmationType =
  | typeof CONFIRMATION_TIPE_PERPANJANG
  | typeof CONFIRMATION_TIPE_CLOSE;
export const CONFIRMATION_TIPE_PERPANJANG = 1;
export const CONFIRMATION_TIPE_CLOSE = 2;

export const EMPLOYEE_ID_SYSTEM = 'Sistem';
