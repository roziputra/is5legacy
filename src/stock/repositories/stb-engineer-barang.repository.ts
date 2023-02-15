import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StbEngineerBarang } from '../entities/stb-engineer-barang.entity';

@Injectable()
export class StbEngineerBarangRepository extends Repository<StbEngineerBarang> {
  constructor(private dataSource: DataSource) {
    super(StbEngineerBarang, dataSource.createEntityManager());
  }
}
