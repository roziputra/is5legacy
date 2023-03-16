import { Customer } from './customer.entity';
import {
  BaseEntity,
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'sms_phonebook', synchronize: false })
export class SMSPhonebook extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ select: false })
  custId: string;

  @Column()
  phone: string;

  @Column()
  name: string;

  @Column()
  billing: boolean;

  @Column()
  technical: boolean;

  @Column()
  salutationid: string;

  @CreateDateColumn()
  insertTime: Date;

  @Column()
  insertBy: string;

  @ManyToOne(() => Customer, (customer) => customer.ListPhonebook)
  @JoinColumn({ name: 'custId', referencedColumnName: 'CustId' })
  Cust!: Customer;
}
