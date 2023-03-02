import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StbRequest } from '../entities/stb-request.entity';
import { Master } from '../entities/master.entity';
import { StbRequestDetail } from '../entities/stb-request-detail.entity';
import { StbEngineer } from '../entities/stb-engineer.entity';

@Injectable()
export class StbRequestRepository extends Repository<StbRequest> {
  constructor(private dataSource: DataSource) {
    super(StbRequest, dataSource.createEntityManager());
  }

  findOneStbRequest(id: number): Promise<StbRequest> {
    return this.createQueryBuilder('stbr')
      .where('stbr.id = :id', { id: id })
      .leftJoinAndMapMany(
        'stbr.details',
        StbRequestDetail,
        'detail',
        'stbr.id = detail.stb_request_id',
      )
      .leftJoinAndMapOne(
        'stbr.stb',
        StbEngineer,
        'stb',
        'stb.request_id = stbr.id',
      )
      .leftJoinAndMapOne('detail.master', Master, 'm', 'm.Code = detail.code')
      .getOne();
  }
}
