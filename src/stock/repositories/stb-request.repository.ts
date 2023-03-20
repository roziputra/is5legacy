import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
  STATUS_PENDING,
  StbRequest,
  TYPE_MOVED,
} from '../entities/stb-request.entity';
import { RequestType, StbEngineer } from '../entities/stb-engineer.entity';
import {
  IPaginationOptions,
  Pagination,
  paginate,
  paginateRaw,
} from 'nestjs-typeorm-paginate';
import { Employee } from 'src/employees/employee.entity';

@Injectable()
export class StbRequestRepository extends Repository<StbRequest> {
  constructor(private dataSource: DataSource) {
    super(StbRequest, dataSource.createEntityManager());
  }

  findOneStbRequest(id: number): Promise<StbRequest> {
    return this.createQueryBuilder('stbr')
      .where('stbr.id = :id', { id: id })
      .leftJoinAndMapOne(
        'stbr.stb',
        StbEngineer,
        'stb',
        'stb.request_id = stbr.id',
      )
      .leftJoinAndMapOne(
        'stbr.eng',
        Employee,
        'eng',
        'eng.EmpId = stbr.engineer',
      )
      .leftJoinAndMapOne(
        'stbr.rej',
        Employee,
        'rej',
        'rej.EmpId = stbr.rejectedBy',
      )
      .leftJoinAndMapOne(
        'stbr.cre',
        Employee,
        'cre',
        'cre.EmpId = stbr.createdBy',
      )
      .leftJoinAndMapOne(
        'stb.app',
        Employee,
        'app',
        'app.EmpId = stb.approvedBy',
      )
      .getOne();
  }

  async finAllStbRequest(
    requestType,
    status,
    options: IPaginationOptions,
  ): Promise<Pagination<StbRequest>> {
    const query = await this.createQueryBuilder('stbr')
      .leftJoinAndMapOne(
        'stbr.stb',
        StbEngineer,
        'stb',
        'stb.request_id = stbr.id',
      )
      .leftJoinAndMapOne(
        'stbr.eng',
        Employee,
        'eng',
        'eng.EmpId = stbr.engineer',
      )
      .leftJoinAndMapOne(
        'stbr.rej',
        Employee,
        'rej',
        'rej.EmpId = stbr.rejectedBy',
      )
      .leftJoinAndMapOne(
        'stbr.cre',
        Employee,
        'cre',
        'cre.EmpId = stbr.createdBy',
      )
      .leftJoinAndMapOne(
        'stb.app',
        Employee,
        'app',
        'app.EmpId = stb.approvedBy',
      )
      .where('stbr.requestType = :requestType', { requestType: requestType })
      .andWhere('stbr.status in (:...status)', { status: status });
    return paginate<StbRequest>(query, options);
  }

  findOneStbTransfer(id: number): Promise<StbRequest> {
    return this.createQueryBuilder('stbr')
      .where('stbr.id = :id', { id: id })
      .leftJoinAndMapOne(
        'stbr.stb',
        StbEngineer,
        'stb',
        'stb.requestId = stbr.id',
      )
      .leftJoinAndMapOne(
        'stbr.eng',
        Employee,
        'eng',
        'eng.EmpId = stbr.engineer',
      )
      .leftJoinAndMapOne(
        'stbr.rej',
        Employee,
        'rej',
        'rej.EmpId = stbr.rejectedBy',
      )
      .leftJoinAndMapOne(
        'stbr.cre',
        Employee,
        'cre',
        'cre.EmpId = stbr.createdBy',
      )
      .leftJoinAndMapOne(
        'stb.app',
        Employee,
        'app',
        'app.EmpId = stb.approvedBy',
      )
      .getOne();
  }

  findAllStbTransfer(
    user: string,
    transferType: string[],
    status: string[],
    options: IPaginationOptions,
  ): Promise<Pagination<any>> {
    const query = this.dataSource
      .createQueryBuilder()
      .from((q) => {
        return q
          .select([
            'id',
            'engineer',
            'branch_id branchId',
            'request_type requestType',
            'request_date requestDate',
            'status',
            'rejected_by rejectedBy',
            'rejected_reason rejectedReason',
            'description',
            'created_by createdBy',
            'created_at createdAt',
            'updated_at updatedAt',
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
      .leftJoin(Employee, 'eng', 'eng.EmpId = s.engineer')
      .leftJoin(Employee, 'cre', 'cre.EmpId = s.createdBy')
      .leftJoin(Employee, 'rej', 'rej.EmpId = s.rejectedBy')
      .leftJoin(Employee, 'app', 'app.EmpId = stb.approvedBy')
      .select([
        's.id',
        's.transferType',
        's.engineer',
        's.branchId',
        's.requestType',
        's.requestDate',
        's.status',
        's.rejectedBy',
        's.rejectedReason',
        's.description',
        's.createdBy',
        's.createdAt',
        's.updatedAt',
      ])
      .addSelect([
        'stb.id stb_id',
        'stb.approved_by stb_approvedBy',
        'stb.approved_date stb_approvedDate',
      ])
      .addSelect([
        'eng.EmpId eng_EmpId',
        'eng.EmpFName eng_EmpFName',
        'eng.EmpLName eng_EmpLName',
      ])
      .addSelect([
        'cre.EmpId cre_EmpId',
        'cre.EmpFName cre_EmpFName',
        'cre.EmpLName cre_EmpLName',
      ])
      .addSelect([
        'rej.EmpId rej_EmpId',
        'rej.EmpFName rej_EmpFName',
        'rej.EmpLName rej_EmpLName',
      ])
      .addSelect([
        'app.EmpId stb_app_EmpId',
        'app.EmpFName stb_app_EmpFName',
        'app.EmpLName stb_app_EmpLName',
      ])
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
