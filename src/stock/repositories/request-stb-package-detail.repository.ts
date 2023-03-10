import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RequestStbPackageDetail } from '../entities/request-stb-package-detail.entity';
import { Master } from '../entities/master.entity';
import { Box } from '../entities/box.entity';

@Injectable()
export class RequestStbPackageDetailRepository extends Repository<RequestStbPackageDetail> {
  constructor(private dataSource: DataSource) {
    super(RequestStbPackageDetail, dataSource.createEntityManager());
  }

  findPackageDetails(
    id: number,
    branch: string,
  ): Promise<RequestStbPackageDetail[]> {
    return this.createQueryBuilder('detail')
      .leftJoinAndMapOne(
        'detail.master',
        Master,
        'm',
        'm.code = detail.code and m.branch = :branch',
        {
          branch: branch,
        },
      )
      .leftJoinAndMapMany(
        'detail.units',
        Box,
        'b',
        'b.code = detail.code and b.branch = :branch',
        {
          branch: branch,
        },
      )
      .where('detail.requestStbPackageId = :id', { id: id })
      .select(['detail.id', 'detail.code', 'detail.qty', 'm.name', 'b.name'])
      .getMany();
  }
}
