import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TicketPic } from '../entities/ticket-pic.entity';

@Injectable()
export class TicketPicRepository extends Repository<TicketPic> {
  constructor(private dataSource: DataSource) {
    super(TicketPic, dataSource.createEntityManager());
  }
}
