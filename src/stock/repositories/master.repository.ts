import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Master } from '../entities/master.entity';

@Injectable()
export class MasterRepository extends Repository<Master> {
  constructor(private dataSource: DataSource) {
    super(Master, dataSource.createEntityManager());
  }
}
