import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { StbRequestDetail } from '../entities/stb-request-detail.entity';
import { StbRequest } from '../entities/stb-request.entity';
import { Master } from '../entities/master.entity';

@Injectable()
export class StbRequestDetailRepository extends Repository<StbRequestDetail> {
  constructor(private dataSource: DataSource) {
    super(StbRequestDetail, dataSource.createEntityManager());
  }

  findAllDetails(stbRequestId: number): Promise<any> {
    return this.createQueryBuilder('d')
      .select([
        'd.id id',
        'm.name name',
        'd.serial serial',
        'd.code code',
        'd.qty qty',
        'd.unit unit',
      ])
      .leftJoin(StbRequest, 'r', 'r.id = d.stbRequestId')
      .leftJoin(Master, 'm', 'm.code = d.code and m.branchId = r.branchId')
      .where('d.stbRequestId = :stbRequestId', { stbRequestId: stbRequestId })
      .getRawMany();
  }
}
