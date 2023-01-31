import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { SMSPhonebook } from '../entities/sms-phonebook.entity';
import { NewCustomerInitValue } from '../interfaces/new-customer.interface';

@Injectable()
export class CustomerPhonebookRepository extends Repository<SMSPhonebook> {
  constructor(private dataSource: DataSource) {
    super(SMSPhonebook, dataSource.createEntityManager());
  }

  assignSmsPhonebook(newCustomerValue: NewCustomerInitValue): any {
    const smsPhoneBook1 = new SMSPhonebook();
    const smsPhoneBook2 = new SMSPhonebook();
    if (newCustomerValue.billingPhone != newCustomerValue.technicalPhone) {
      smsPhoneBook1.phone = newCustomerValue.billingPhone;
      smsPhoneBook1.name = newCustomerValue.billingName.toUpperCase();
      smsPhoneBook1.custId = newCustomerValue.custId;
      smsPhoneBook1.billing = DEFAULT_BILLING_SMS_PHONEBOOK_1;
      smsPhoneBook1.technical = DEFAULT_TECHNICAL_SMS_PHONEBOOK_1;
      smsPhoneBook1.salutationid = newCustomerValue.billingSalutation;
      smsPhoneBook1.insertTime = new Date();
      smsPhoneBook1.insertBy = newCustomerValue.approvalEmpId;

      smsPhoneBook2.phone = newCustomerValue.technicalPhone;
      smsPhoneBook2.name = newCustomerValue.technicalName.toUpperCase();
      smsPhoneBook2.custId = newCustomerValue.custId;
      smsPhoneBook2.billing = DEFAULT_BILLING_SMS_PHONEBOOK_2;
      smsPhoneBook2.technical = DEFAULT_TECHNICAL_SMS_PHONEBOOK_2;
      smsPhoneBook2.salutationid = newCustomerValue.technicalSalutation;
      smsPhoneBook2.insertTime = new Date();
      smsPhoneBook2.insertBy = newCustomerValue.approvalEmpId;
    } else {
      smsPhoneBook1.phone = newCustomerValue.billingPhone;
      smsPhoneBook1.name = newCustomerValue.billingName.toUpperCase();
      smsPhoneBook1.custId = newCustomerValue.custId;
      smsPhoneBook1.billing = DEFAULT_BILLING_SMS_PHONEBOOK_1;
      smsPhoneBook1.technical = DEFAULT_TECHNICAL_SMS_PHONEBOOK_1;
      smsPhoneBook1.salutationid = newCustomerValue.billingSalutation;
      smsPhoneBook1.insertTime = new Date();
      smsPhoneBook1.insertBy = newCustomerValue.approvalEmpId;
    }

    return {
      smsPhoneBook1,
      smsPhoneBook2,
    };
  }
}

export const DEFAULT_BILLING_SMS_PHONEBOOK_1 = true;
export const DEFAULT_TECHNICAL_SMS_PHONEBOOK_1 = false;

export const DEFAULT_BILLING_SMS_PHONEBOOK_2 = false;
export const DEFAULT_TECHNICAL_SMS_PHONEBOOK_2 = true;
