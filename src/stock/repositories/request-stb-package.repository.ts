import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RequestStbPackage } from '../entities/request-stb-package.entity';
import { Employee } from 'src/employees/employee.entity';

@Injectable()
export class RequestStbPackageRepository extends Repository<RequestStbPackage> {
  constructor(private dataSource: DataSource) {
    super(RequestStbPackage, dataSource.createEntityManager());
  }

  findAllPackage(): Promise<RequestStbPackage[]> {
    return this.createQueryBuilder('pkg')
      .leftJoinAndMapOne(
        'pkg.insertBy',
        Employee,
        'e',
        'e.EmpId = pkg.insertBy',
      )
      .select(['pkg.id', 'pkg.title', 'pkg.description', 'pkg.insertTime'])
      .addSelect('e.EmpId')
      .addSelect('e.EmpFName')
      .addSelect('e.EmpLName')
      .getMany();
  }
}
