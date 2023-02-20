import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { StbEngineerBarang } from '../entities/stb-engineer-barang.entity';
import { STATUS_ACCEPTED } from '../entities/stb-engineer.entity';

@Injectable()
export class StbEngineerBarangRepository extends Repository<StbEngineerBarang> {
  constructor(private dataSource: DataSource) {
    super(StbEngineerBarang, dataSource.createEntityManager());
  }
  findEngineerInventory(branch, engineer, search) {
    const query = this.createQueryBuilder('barang')
      .select([
        'stb.id id',
        'barang.code code',
        'barang.serial serial',
        'barang.qty qty',
        'm.Name name',
      ])
      .leftJoin('stb_engineer', 'stb', 'stb.id = barang.stb_engineer_id')
      .leftJoin(
        'Master',
        'm',
        'm.Code = barang.code and m.Branch = stb.branch_id',
      )
      .where('stb.status = :status', { status: STATUS_ACCEPTED });
    if (branch) {
      query.andWhere('stb.branch_id = :branch', { branch: branch });
    }
    if (engineer) {
      query.andWhere('stb.engineer = :engineer', { engineer: engineer });
    }
    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('m.Name like :name', {
            name: `%${search}%`,
          })
            .orWhere('barang.code like :code', { code: `%${search}%` })
            .orWhere('barang.serial like :serial', { serial: `%${search}%` });
        }),
      );
    }
    return query.getRawMany();
  }

  getInventoryByStbId(stbEngineerId: number): Promise<any> {
    return this.createQueryBuilder('barang')
      .select([
        'stb.id id',
        'barang.code code',
        'barang.serial serial',
        'barang.qty qty',
        'm.Name name',
      ])
      .leftJoin('stb_engineer', 'stb', 'stb.id = barang.stb_engineer_id')
      .leftJoin(
        'Master',
        'm',
        'm.Code = barang.code and m.Branch = stb.branch_id',
      )
      .where('stb_engineer_id = :stbId', { stbId: stbEngineerId })
      .getRawMany();
  }
}
