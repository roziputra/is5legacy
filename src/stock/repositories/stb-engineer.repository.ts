import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StbEngineer } from '../entities/stb-engineer.entity';

@Injectable()
export class StbEngineerRepository extends Repository<StbEngineer> {
  constructor(private dataSource: DataSource) {
    super(StbEngineer, dataSource.createEntityManager());
  }
}
