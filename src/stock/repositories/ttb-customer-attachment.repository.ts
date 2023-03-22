import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TtbCustomerAttachment } from '../entities/ttb-customer-attachment.entity';

@Injectable()
export class TtbCustomerAttachmentRepository extends Repository<TtbCustomerAttachment> {
  constructor(private dataSource: DataSource) {
    super(TtbCustomerAttachment, dataSource.createEntityManager());
  }
}
