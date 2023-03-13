import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity({ name: 'NPWP_Customer', synchronize: false })
export class NPWPCustomer extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  Id: string;

  @Column()
  Name: string;

  @Column()
  Address: string;

  @Column()
  NPWP: string;

  @Column({ select: false })
  CustId: string;

  @Column()
  Selected: boolean;

  @ManyToOne(() => Customer, (customer) => customer.ListNPWP)
  @JoinColumn({ name: 'CustId', referencedColumnName: 'CustId' })
  Cust: Customer;
}
