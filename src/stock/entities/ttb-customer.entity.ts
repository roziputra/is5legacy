import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { TtbCustomerDetail } from './ttb-customer-detail.entity';

@Entity({ name: 'ttb_customer', synchronize: false })
export class TtbCustomer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'branch_id' })
  @Expose({ name: 'branch_id' })
  branchId: string;

  @Column({ name: 'no_surat' })
  @Expose({ name: 'no_surat' })
  noSurat: string;

  @Column({ name: 'engineer_id' })
  engineer: string;

  @Column({ name: 'tts_id' })
  @Expose({ name: 'ticket_id' })
  ticketId: number;

  @Column({ name: 'sales_id' })
  @Expose({ name: 'sales_id' })
  salesId: string;

  @Column({ name: 'approved_by' })
  @Expose({ name: 'approved_by' })
  approvedBy: string;

  @Column({ name: 'approved_date' })
  @Expose({ name: 'approved_date' })
  approvedDate: Date;

  @Column({ name: 'cust_serv_id' })
  @Expose({ name: 'cust_serv_id' })
  customerServiceId: number;

  @Column({ default: 0 })
  setup: boolean;

  @Column()
  date: Date;

  @Column()
  description: string;

  @Column({ name: 'is_draft' })
  @Expose({ name: 'is_draft' })
  isDraft: boolean;

  @Column({ name: 'created_by' })
  @Expose({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => TtbCustomerDetail, (ttb) => ttb.ttbCustomer)
  details: TtbCustomerDetail[];

  @BeforeInsert()
  createDates() {
    const nowDate = new Date();
    this.createdAt = nowDate;
    this.updatedAt = nowDate;
  }

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date();
  }
}
