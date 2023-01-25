import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'CustomerFix', synchronize: false })
export class CustomerFix extends BaseEntity {
  @PrimaryColumn()
  CustId: string;

  @Column()
  BranchId: string;

  @Column()
  CustPass: string;

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
  CustJobTitle: string;

  @Column()
  CustCompany: string;

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
  CustBillCPEmail: string;

  @Column()
  CustBillCPPosition: string;

  @Column()
  CustRegDate: Date;

  @Column()
  CustNotes: string;

  @Column()
  EmpApproval: string;

  @Column()
  CustStatus: string;

  @Column()
  SalesId: string;

  @Column()
  InsertDateTime: Date;

  @Column()
  InsertEmpId: string;

  @Column()
  UpdateDateTime: Date;

  @Column()
  TaxType: boolean;
}
