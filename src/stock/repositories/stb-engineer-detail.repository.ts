import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { STATUS_ACCEPTED } from '../entities/stb-engineer.entity';
import { StbEngineerDetail } from '../entities/stb-engineer-detail.entity';

@Injectable()
export class StbEngineerDetailRepository extends Repository<StbEngineerDetail> {
  constructor(private dataSource: DataSource) {
    super(StbEngineerDetail, dataSource.createEntityManager());
  }
  findEngineerInventory(engineerId: string, search: string) {
    const query = this.createQueryBuilder('detail')
      .select([
        'stb.id id',
        'detail.code code',
        'detail.serial serial',
        'detail.qty qty',
        'detail.unit unit',
        'm.Name name',
      ])
      .leftJoin('stb_engineer', 'stb', 'stb.id = detail.stb_engineer_id')
      .leftJoin(
        'Master',
        'm',
        'm.Code = detail.code and m.Branch = stb.branch_id',
      )
      .where('stb.status = :status', { status: STATUS_ACCEPTED });

    if (engineerId) {
      query.andWhere('stb.engineer = :engineer', { engineer: engineerId });
    }
    if (search) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('m.Name like :name', {
            name: `%${search}%`,
          })
            .orWhere('detail.code like :code', { code: `%${search}%` })
            .orWhere('detail.serial like :serial', { serial: `%${search}%` });
        }),
      );
    }
    return query.getRawMany();
  }

  getInventoryByStbId(stbEngineerId: number): Promise<any> {
    return this.createQueryBuilder('detail')
      .select([
        'stb.id id',
        'detail.code code',
        'detail.serial serial',
        'detail.qty qty',
        'm.Name name',
      ])
      .leftJoin('stb_engineer', 'stb', 'stb.id = detail.stb_engineer_id')
      .leftJoin(
        'Master',
        'm',
        'm.Code = detail.code and m.Branch = stb.branch_id',
      )
      .where('stb_engineer_id = :stbId', { stbId: stbEngineerId })
      .getRawMany();
  }
}
