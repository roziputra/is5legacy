import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
  STATUS_PENDING,
  StbRequest,
  TYPE_MOVED,
} from '../entities/stb-request.entity';
import { Master } from '../entities/master.entity';
import { StbRequestDetail } from '../entities/stb-request-detail.entity';
import { StbEngineer } from '../entities/stb-engineer.entity';
import { IPaginationOptions, paginateRaw } from 'nestjs-typeorm-paginate';

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

  findOneStbTransfer(id: number): Promise<any> {
    return this.createQueryBuilder('stbr')
      .where('stbr.id = :id', { id: id })
      .leftJoinAndMapOne(
        'stbr.stb',
        StbEngineer,
        'stb',
        'stb.requestId = stbr.id',
      )
      .getOne();
  }

  findAllStbTransfer(
    user: string,
    transferType: string[],
    status: string[],
    options: IPaginationOptions,
  ): Promise<any> {
    const query = this.dataSource
      .createQueryBuilder()
      .select([
        's.id',
        'stb.id',
        's.transferType transfer_type',
        's.engineer',
        's.branch_id',
        's.request_type',
        's.request_date',
        's.status',
        's.rejected_by',
        's.rejected_reason',
        's.description',
        's.created_by',
        's.created_at',
        's.updated_at',
      ])
      .from((q) => {
        return q
          .select([
            'r.id id',
            'r.engineer engineer',
            'r.branch_id branch_id',
            'r.request_type request_type',
            'r.request_date request_date',
            'r.status status',
            'r.rejected_by rejected_by',
            'r.rejected_reason rejected_reason',
            'r.description description',
            'r.created_by',
            'r.created_at',
            'r.updated_at',
          ])
          .addSelect(
            `case when created_by = :user 
                then 'permintaan'
              when engineer = :user
                then 'penerimaan'
              else '' end`,
            'transferType',
          )
          .from(StbRequest, 'r')
          .where('r.request_type = :requestType')
          .andWhere('r.status in (:...status)');
      }, 's')
      .where('s.transferType in (:...transferType)', {
        transferType: transferType,
      })
      .leftJoin(StbEngineer, 'stb', 'stb.requestId = s.id')
      .setParameters({
        user: user,
        requestType: TYPE_MOVED,
        status: status,
      });
    return paginateRaw<any>(query, options);
  }

  getTotalPermintaanPindahBarang(user: string): Promise<any> {
    return this.createQueryBuilder('stbr')
      .select('count(*)', 'total')
      .where('stbr.requestType = :requestType')
      .andWhere('stbr.status = :status')
      .andWhere('stbr.engineer = :user')
      .setParameters({
        requestType: TYPE_MOVED,
        status: STATUS_PENDING,
        user: user,
      })
      .getRawOne();
  }
}
