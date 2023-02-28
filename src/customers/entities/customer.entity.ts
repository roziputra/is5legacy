import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Customer', synchronize: false })
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  AI: number;

  @Column({ unique: true })
  CustId: string;

  @Column()
  BranchId: string;

  @Column()
  CustPass: string;

  @Column()
  DisplayBranchId: string;

  @Column()
  FormId: string;

  @Column()
  CustName: string;

  @Column()
  CustGender: string;

  @Column()
  custPOB: string;

  @Column({ type: 'date' })
  custDOB: string;

  @Column()
  CustIdType: string;

  @Column()
  CustIdNumber: string;

  @Column()
  CustCompany: string;

  @Column()
  CustJobTitle: string;

  @Column()
  CustBusName: string;

  @Column()
  BusId: string;

  @Column()
  CustResAdd1: string;

  @Column()
  CustResCity: string;

  @Column()
  CustResZC: string;

  @Column()
  CustOfficeAdd1: string;

  @Column()
  CustOfficeCity: string;

  @Column()
  CustOfficeZC: string;

  @Column()
  CustBillingAdd: boolean;

  @Column()
  CustTechCP: string;

  @Column()
  CustTechCPPosition: string;

  @Column()
  CustBillCP: string;

  @Column()
  CustBillCPPosition: string;

  @Column()
  CustBillMethodLetter: boolean;

  @Column()
  CustBillMethodEmail: boolean;

  @Column()
  CustBillCPEmail: string;

  @Column()
  CustPPn: number;

  @Column({ default: 0 })
  CustDiscount: number;

  @Column({ default: 0 })
  CustBalance: number;

  @Column({ default: 0 })
  CustBalanceVB: number;

  @Column({ default: 0 })
  CustBalanceWireless: number;

  @Column({ default: 0 })
  CustBalanceCB: number;

  @Column()
  CustRegDate: Date;

  @Column()
  EmpApproval: string;

  @Column()
  CustStatus: string;

  @Column()
  SalesId: string;

  @Column()
  InsertEmpId: string;

  @Column()
  InsertDateTime: Date;

  @Column()
  UpdateDateTime: Date;

  @Column()
  TaxType: boolean;

  @Column({ default: 0 })
  RekType: number;

  @Column()
  CetakDuluan: boolean;

  @Column()
  ManagerSalesId: string;
}
