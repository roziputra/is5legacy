import {
  BaseEntity,
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Services } from 'src/services/entities/service.entity';
import { InvoiceTypeMonth } from './invoice-type-month.entity';

@Entity({ name: 'CustomerServices', synchronize: false })
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'CustServId' })
  id: number;

  @Column({ select: false })
  CustId: string;

  @Column()
  ServiceId: string;

  @Column()
  ServiceType: string;

  @Column()
  EmpId: string;

  @Column()
  PayId: string;

  @Column()
  CustStatus: string;

  @Column()
  CustRegDate: Date;

  @Column()
  CustActivationDate: Date;

  @Column()
  CustUpdateDate: Date;

  @Column()
  CustBlockDate: Date;

  @Column()
  CustBlockFrom: boolean;

  @Column({ name: 'Discount' })
  discount: number;

  @Column()
  CustAccName: string;

  @Column()
  EmpIdEdit: string;

  @Column()
  Opsi: boolean;

  @Column()
  StartTrial: Date;

  @Column()
  EndTrial: Date;

  @Column()
  StatusPerangkat: string;

  @Column()
  Gabung: boolean;

  @Column()
  Tampil: boolean;

  @Column()
  TglHarga: Date;

  @Column({ default: 0 })
  Subscription: string;

  @Column()
  InvoiceType: string;

  @Column()
  InvoicePeriod: string;

  @Column()
  InvoiceDate1: boolean;

  @Column()
  AddEmail: string;

  @Column()
  AddEmailCharge: boolean;

  @Column()
  AccessLog: boolean;

  @Column()
  Description: string;

  @Column()
  CustNotes: string;

  @Column()
  Notes: string;

  @Column()
  installation_address: string;

  @Column()
  ContractUntil: Date;

  @Column()
  Type: string;

  @Column()
  promo_id: string;

  @Column()
  BlockTypeId: boolean;

  @Column()
  BlockTypeDate: string;

  @Column()
  CustBlockFromMenu: string;

  @Column()
  IPServer: string;

  @Column()
  PPN: string;

  @Column()
  CustCloseReason: string;

  @Column()
  Surveyor: string;

  @OneToOne(() => Customer)
  @JoinColumn({ name: 'CustId', referencedColumnName: 'CustId' })
  customer: Customer;

  @OneToOne(() => Services)
  @JoinColumn({ name: 'ServiceId' })
  service: Services;

  @OneToOne(() => InvoiceTypeMonth)
  @JoinColumn({ name: 'InvoiceType', referencedColumnName: 'InvoiceType' })
  typeMonth: InvoiceTypeMonth;

  @ManyToOne(() => Customer, (customer) => customer.ListOfService, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'CustId', referencedColumnName: 'CustId' })
  Cust!: Customer;

  static transformQueryBuildSubscription(custSubs: Subscription) {
    return {
      package_code: custSubs.ServiceId,
      package_price: custSubs.Subscription,
      package_top: custSubs.typeMonth.Month,
    };
  }
}
