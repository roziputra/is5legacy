import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'CustomerProfileHistory', synchronize: false })
export class CustomerProfileHistory extends BaseEntity {
  @PrimaryColumn()
  CustId: string;

  @Column()
  AI: number;

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
  CustJobTitle: string;

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
  CustRegDate: Date;

  @Column()
  CustNotes: string;

  @Column()
  EmpApproval: string;

  @Column()
  HistoryInsertEmpId: string;

  @Column()
  CustStatus: string;

  @Column()
  SalesId: string;

  @Column()
  InsertEmpId: string;

  @Column()
  InsertDateTime: Date;

  @Column()
  HistoryInsertTime: Date;

  @Column()
  UpdateDateTime: Date;

  @Column()
  TaxType: boolean;

  @Column()
  CetakDuluan: boolean;

  @Column()
  ManagerSalesId: string;
}
