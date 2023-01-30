import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'CustomerServices', synchronize: false })
export class Subscription extends BaseEntity {
  @PrimaryColumn()
  CustServId: string;

  @Column()
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

  @Column()
  Subscription: string;

  @Column()
  InvoiceType: string;

  @Column()
  InvoicePeriod: string;

  @Column()
  InvoiceDate1: boolean;

  @Column()
  AddEmailCharge: boolean;

  @Column()
  AccessLog: boolean;

  @Column()
  Description: string;

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
}
