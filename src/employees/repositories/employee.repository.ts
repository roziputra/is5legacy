import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Employee } from '../employee.entity';

@Injectable()
export class EmployeeRepository extends Repository<Employee> {
  constructor(private dataSource: DataSource) {
    super(Employee, dataSource.createEntityManager());
  }

  findAll(
    branchId: string[],
    departmentId: string[],
    status: string[],
    options: IPaginationOptions,
  ) {
    let query = this.createQueryBuilder('emp');
    if (branchId.length) {
      query = query.andWhere('emp.branchId in (:...branchId)', {
        branchId: branchId,
      });
    }
    if (departmentId.length) {
      query = query.andWhere('emp.departmentId in (:...departmentId)', {
        departmentId: departmentId,
      });
    }
    if (status.length) {
      query = query.andWhere('emp.joinStatus = (:...joinStatus)', {
        status: status,
      });
    }
    return paginate<Employee>(query, options);
  }
}
