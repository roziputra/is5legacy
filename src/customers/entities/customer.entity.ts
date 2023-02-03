import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Customer', synchronize: false })
export class Customer extends BaseEntity {
  @PrimaryColumn()
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
  CustResAdd2: string;

  @Column()
  CustResCity: string;

  @Column()
  CustResZC: string;

  @Column()
  CustOfficeAdd1: string;

  @Column()
  CustOfficeAdd2: string;

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

  @Column()
  CetakDuluan: boolean;

  @Column()
  ManagerSalesId: string;
}
