import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
import { StbEngineer, TYPE_REQUESTED } from '../entities/stb-engineer.entity';
import { StbEngineerDetail } from '../entities/stb-engineer-detail.entity';
import { Master } from '../entities/master.entity';

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
      .where('stb.request_type = :type', { type: TYPE_REQUESTED });

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

  /**
   *  deprecated
   */
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

  findAllDetails(stbEngineerId: number): Promise<any> {
    return this.createQueryBuilder('d')
      .select([
        'd.id ida',
        'm.name name',
        'd.serial serial',
        'd.code code',
        'd.qty qty',
        'd.unit unit',
      ])
      .leftJoin(StbEngineer, 'stb', 'stb.id = d.stbEngineerId')
      .leftJoin(Master, 'm', 'm.code = d.code and m.branchId = stb.branchId')
      .where('d.stbEngineerId = :stbEngineerId', {
        stbEngineerId: stbEngineerId,
      })
      .getRawMany();
  }
}
