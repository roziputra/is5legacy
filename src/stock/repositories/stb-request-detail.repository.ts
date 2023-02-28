import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { STATUS_ACCEPTED } from '../entities/stb-engineer.entity';
import { StbRequestDetail } from '../entities/stb-request-detail.entity';

@Injectable()
export class StbRequestDetailRepository extends Repository<StbRequestDetail> {
  constructor(private dataSource: DataSource) {
    super(StbRequestDetail, dataSource.createEntityManager());
  }
}
