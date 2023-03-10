import { Subscription } from './subscriber.entity';
import { SMSPhonebook } from './sms-phonebook.entity';
import { NPWPCustomer } from './customer-npwp.entity';
import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

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
  CustHP: string;

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
  CustOfficePhone: string;

  @Column()
  CustBillingAdd: boolean;

  @Column()
  CustTechCP: string;

  @Column()
  CustTechCPEmail: string;

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

  @OneToMany(() => Subscription, (subscription) => subscription.Cust)
  ListOfService: Subscription[];

  @OneToMany(() => SMSPhonebook, (smsphonebook) => smsphonebook.Cust)
  ListPhonebook: SMSPhonebook[];

  @OneToMany(() => NPWPCustomer, (npwp) => npwp.Cust)
  ListNPWP: NPWPCustomer[];

  static transformQueryBuilderCustomer(customerObj: Customer) {
    return {
      branch_id: customerObj.BranchId,
      display_branch_id: customerObj.DisplayBranchId,
      full_name: customerObj.CustName,
      gender: customerObj.CustGender,
      place_of_birth: customerObj.custPOB,
      date_of_birth: customerObj.custDOB,
      email_address: customerObj.CustBillCPEmail,
      phone_number: customerObj.CustHP,
      address: [
        customerObj.CustResAdd1,
        customerObj.CustResAdd2,
        customerObj.CustResCity,
      ].join(', '),
      identity_type: customerObj.CustIdType,
      identity_number: customerObj.CustIdNumber,
      company_name: customerObj.CustCompany,
      company_address: [
        customerObj.CustOfficeAdd1,
        customerObj.CustOfficeAdd2,
        customerObj.CustOfficeCity,
      ].join(', '),
      company_phone_number: customerObj.CustOfficePhone,
      billing_name: customerObj.CustBillCP,
      billing_email: customerObj.CustBillCPEmail,
      technical_name: customerObj.CustTechCP,
      technical_email: customerObj.CustTechCPEmail,
      sales_id: customerObj.SalesId,
      manager_sales_id: customerObj.ManagerSalesId,
      list_of_services: customerObj.ListOfService.map((subs) => {
        return Subscription.transformQueryBuildSubscription(subs);
      }),
      billing_phone:
        customerObj.ListPhonebook.find(
          (smsph) => smsph.name == customerObj.CustBillCP,
        ) !== undefined
          ? customerObj.ListPhonebook.find(
              (smsph) => smsph.name == customerObj.CustBillCP,
            ).phone
          : '',
      technical_phone:
        customerObj.ListPhonebook.find(
          (smsph) => smsph.name == customerObj.CustTechCP,
        ) !== undefined
          ? customerObj.ListPhonebook.find(
              (smsph) => smsph.name == customerObj.CustTechCP,
            ).phone
          : '',
      npwp_number: customerObj.ListNPWP.find((npwp) => npwp.Selected == true)
        .NPWP,
    };
  }
}
