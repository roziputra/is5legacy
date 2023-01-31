import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { SMSPhonebook } from '../entities/sms-phonebook.entity';

@Injectable()
export class CustomerPhonebookRepository extends Repository<SMSPhonebook> {
  constructor(private dataSource: DataSource) {
    super(SMSPhonebook, dataSource.createEntityManager());
  }
}

export const DEFAULT_BILLING_SMS_PHONEBOOK_1 = true;
export const DEFAULT_TECHNICAL_SMS_PHONEBOOK_1 = false;

export const DEFAULT_BILLING_SMS_PHONEBOOK_2 = false;
export const DEFAULT_TECHNICAL_SMS_PHONEBOOK_2 = true;
