import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RequestStbPackage } from '../entities/request-stb-package.entity';
import { Employee } from 'src/employees/employee.entity';
import { RequestStbPackageDetail } from '../entities/request-stb-package-detail.entity';
import { Master } from '../entities/master.entity';
import { Box } from '../entities/box.entity';

@Injectable()
export class RequestStbPackageRepository extends Repository<RequestStbPackage> {
  constructor(private dataSource: DataSource) {
    super(RequestStbPackage, dataSource.createEntityManager());
  }

  findAllPackage(branch: string): Promise<RequestStbPackage[]> {
    return this.createQueryBuilder('pkg')
      .leftJoinAndMapOne(
        'pkg.insertBy',
        Employee,
        'e',
        'e.EmpId = pkg.insertBy',
      )
      .leftJoinAndMapMany(
        'pkg.details',
        RequestStbPackageDetail,
        'd',
        'd.requestStbPackageId = pkg.id',
      )
      .leftJoinAndMapOne(
        'd.master',
        Master,
        'm',
        'm.code = d.code and m.branch = :branch',
        {
          branch: branch,
        },
      )
      .leftJoinAndMapOne(
        'd.unit',
        Box,
        'b',
        'b.code = d.code and b.branch = :branch',
        {
          branch: branch,
        },
      )
      .select(['pkg.id', 'pkg.title', 'pkg.description', 'pkg.insertTime'])
      .addSelect(['e.EmpId', 'e.EmpFName', 'e.EmpLName'])
      .addSelect(['d.id', 'd.code', 'd.qty'])
      .addSelect(['m.name'])
      .addSelect(['b.name'])
      .getMany();
  }
}
