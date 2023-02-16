import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'CustomerInvoiceTemp', synchronize: false })
export class CustomerInvoice extends BaseEntity {
  @PrimaryColumn({ name: 'InvoiceNum' })
  id: number;

  @Column({ name: 'CustId' })
  customerId: string;

  @Column()
  CustBalance: number;

  @Column()
  CustTotSubsFee: number;

  @Column({ default: 0 })
  CustTotAddCharge: number;

  @Column()
  TotalCharge: number;

  @Column({ default: 0 })
  FinedCharge: number;

  @Column()
  CurrentCharge: number;

  @Column()
  InvoiceDate: Date;

  @Column()
  InvoiceExpDate: Date;

  @Column({ default: '' })
  Notes: string;

  @Column({ default: '' })
  InternalNotes: string;

  @Column()
  InvoiceStatus: string;

  @Column()
  InvoicePaidDate: string;

  @Column({ default: 0 })
  PaidAmount: number;

  @Column({ default: '' })
  PaidVia: string;

  @Column()
  UsagePeriod: string;

  @Column({ name: 'CustServId' })
  subscriptionId: number;

  @Column({ name: 'ServiceId' })
  serviceId: string;

  @Column({ name: 'ServiceIdFor' })
  ServiceIdFor: string;

  @Column()
  Discount: number;

  @Column()
  Akses: number;

  @Column()
  Status: string;

  @Column({ default: 0 })
  Total: number;

  @Column({ default: 0 })
  Penggunaan: number;

  @Column()
  CustAccName: string;

  @Column({ default: 0 })
  PPN: number;

  @Column()
  CurBalance: number;

  @Column({ default: 0 })
  AddCharge: number;

  @Column()
  Gabung: boolean;

  @Column()
  Tampil: boolean;

  @Column()
  Layanan: string;

  @Column()
  Opsi: boolean;

  @Column({ default: 0 })
  Jumlah: number;

  @Column()
  Urut: number;

  @Column()
  Date: Date;

  @Column()
  ServiceGroup: string;

  @Column()
  AddEmail: string;

  @Column({ default: 0 })
  ApprovalFlag: number;

  @Column({ default: 0 })
  InvoiceType: number;

  @Column()
  InvoicePeriod: string;

  @Column()
  PeriodType: number;

  @Column()
  PeriodOrder: number;

  @Column({ default: 0 })
  RekType: number;

  @Column({ default: 0 })
  TBDiscount: number;

  @Column()
  PeriodDescription: string;

  @Column({ default: 0 })
  TaxType: number;

  @Column({ default: 0 })
  TaxNo: number;

  @Column({ default: 0 })
  RInvoiceNum: number;

  @Column({ default: 0 })
  RUrut: number;

  @Column({ default: 0 })
  Reverse: number;

  @Column({ default: 0 })
  Type: number;

  @Column()
  NusaIdInvoiceId: number;

  @Column()
  AwalPeriode: string;

  @Column()
  AkhirPeriode: string;

  @Column()
  RReason: string;

  @Column()
  RConfirmBy: string;

  @Column({ default: 0 })
  InvProrata: number;
}
