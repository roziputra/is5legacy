import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { TtbCustomerDetail } from './ttb-customer-detail.entity';
import { Employee } from 'src/employees/employee.entity';
import { Subscription } from 'src/customers/entities/subscriber.entity';

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
  @Expose({ name: 'engineer_id' })
  engineerId: string;

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

  @OneToOne(() => Employee)
  @JoinColumn({ name: 'approved_by', referencedColumnName: 'EmpId' })
  approved: Employee;

  @Column({ name: 'created_by' })
  @Expose({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => TtbCustomerDetail, (ttb) => ttb.ttbCustomer)
  details: TtbCustomerDetail[];

  @OneToOne(() => Subscription)
  @JoinColumn({ name: 'cust_serv_id' })
  customerService: Subscription;

  @OneToOne(() => Employee)
  @JoinColumn({ name: 'sales_id', referencedColumnName: 'EmpId' })
  sales: Employee;

  @OneToOne(() => Employee)
  @JoinColumn({ name: 'engineer_id', referencedColumnName: 'EmpId' })
  engineer: Employee;
}
