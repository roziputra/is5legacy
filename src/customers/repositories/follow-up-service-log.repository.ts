import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { FollowUpServiceLog } from '../entities/follow-up-service-log.entity';

@Injectable()
export class FollowUpServiceLogRepository extends Repository<FollowUpServiceLog> {
  constructor(private dataSource: DataSource) {
    super(FollowUpServiceLog, dataSource.createEntityManager());
  }
}
