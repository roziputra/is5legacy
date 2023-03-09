import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { GeneralTicketPic } from '../entities/general-ticket-pic.entity';

@Injectable()
export class GeneralTicketPicRepository extends Repository<GeneralTicketPic> {
  constructor(private dataSource: DataSource) {
    super(GeneralTicketPic, dataSource.createEntityManager());
  }
}
