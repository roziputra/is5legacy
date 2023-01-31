import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CustomerVerifiedEmail } from '../entities/customer-verified-email.entity';
import { NewCustomerInitValue } from '../interfaces/new-customer.interface';

@Injectable()
export class CustomerVerifiedEmailRepository extends Repository<CustomerVerifiedEmail> {
  constructor(private dataSource: DataSource) {
    super(CustomerVerifiedEmail, dataSource.createEntityManager());
  }

  assignCustomerVerifiedEmail(newCustomerValue: NewCustomerInitValue): any {
    const CustVerifiedEmail1 = new CustomerVerifiedEmail();
    const CustVerifiedEmail2 = new CustomerVerifiedEmail();
    if (newCustomerValue.billingEmail != newCustomerValue.technicalEmail) {
      CustVerifiedEmail1.cust_id = newCustomerValue.custId;
      CustVerifiedEmail1.cust_email = newCustomerValue.billingEmail;
      CustVerifiedEmail1.email_type = DEFAULT_EMAIL_TYPE_1;
      CustVerifiedEmail1.verified = DEFAULT_VERIFIED_STATUS;

      CustVerifiedEmail2.cust_id = newCustomerValue.custId;
      CustVerifiedEmail2.cust_email = newCustomerValue.technicalEmail;
      CustVerifiedEmail2.email_type = DEFAULT_EMAIL_TYPE_2;
      CustVerifiedEmail2.verified = DEFAULT_VERIFIED_STATUS;
    } else {
      CustVerifiedEmail1.cust_id = newCustomerValue.custId;
      CustVerifiedEmail1.cust_email = newCustomerValue.billingEmail;
      CustVerifiedEmail1.email_type = DEFAULT_EMAIL_TYPE_1;
      CustVerifiedEmail1.verified = DEFAULT_VERIFIED_STATUS;
    }

    return {
      CustVerifiedEmail1,
      CustVerifiedEmail2,
    };
  }
}

export const DEFAULT_EMAIL_TYPE_1 = 'billing';
export const DEFAULT_EMAIL_TYPE_2 = 'technical';
export const DEFAULT_VERIFIED_STATUS = '0';
