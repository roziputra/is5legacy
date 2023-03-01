import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StbEngineer } from '../entities/stb-engineer.entity';
import { StbEngineerDetail } from '../entities/stb-engineer-detail.entity';
import { Master } from '../entities/master.entity';
import { StbRequest } from '../entities/stb-request.entity';

@Injectable()
export class StbEngineerRepository extends Repository<StbEngineer> {
  constructor(private dataSource: DataSource) {
    super(StbEngineer, dataSource.createEntityManager());
  }

  findOneStbEngineer(id: number): Promise<StbEngineer> {
    return this.createQueryBuilder('stb')
      .where('stb.id = :id', { id: id })
      .leftJoinAndMapMany(
        'stb.details',
        StbEngineerDetail,
        'detail',
        'stb.id = detail.stb_engineer_id',
      )
      .leftJoinAndMapOne(
        'stb.stbRequest',
        StbRequest,
        'stbr',
        'stbr.id = stb.request_id',
      )
      .leftJoinAndMapOne('detail.master', Master, 'm', 'm.Code = detail.code')
      .getOne();
  }
}
