import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { TtbCustomer } from './ttb-customer.entity';

@Entity({ name: 'ttb_customer_detail', synchronize: false })
export class TtbCustomerDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ttb_customer_id' })
  @Expose({ name: 'ttb_customer_id' })
  ttbCustomerId: number;

  @Column()
  serial: string;

  @Column()
  code: string;

  @Column()
  qty: number;

  @Column()
  unit: string;

  @Column()
  status: TtbStatus;

  @Column()
  description: string;

  @Column({ name: 'spmb_head_no' })
  spmbHeadNo: string;

  @ManyToOne(() => TtbCustomer)
  @JoinColumn({ name: 'ttb_customer_id' })
  ttbCustomer: TtbCustomer;
}

export enum TtbStatus {
  BELI = 'beli',
  PINJAM = 'pinjam',
  FREE = 'free',
}
