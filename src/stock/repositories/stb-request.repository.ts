import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StbRequest } from '../entities/stb-request.entity';

@Injectable()
export class StbRequestRepository extends Repository<StbRequest> {
  constructor(private dataSource: DataSource) {
    super(StbRequest, dataSource.createEntityManager());
  }
}
