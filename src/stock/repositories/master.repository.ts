import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IS_ACTIVE_TRUE, Master } from '../entities/master.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Box } from '../entities/box.entity';

@Injectable()
export class MasterRepository extends Repository<Master> {
  constructor(private dataSource: DataSource) {
    super(Master, dataSource.createEntityManager());
  }

  findAllWarehouseInventories(
    options: IPaginationOptions,
    search: string,
    branch: string,
  ) {
    const searchLike = {
      search: `%${search}%`,
    };
    const query = this.createQueryBuilder('m')
      .where('m.Branch = :branch', {
        branch: branch,
      })
      .andWhere('isActive = :isActive', { isActive: IS_ACTIVE_TRUE });

    if (search) {
      query.andWhere((q) => {
        q.where('m.name like :search', searchLike).orWhere(
          'm.code like :search',
          searchLike,
        );
      });
    }
    query.leftJoinAndMapMany('m.units', 'm.units', 'u', 'm.Code = u.Code');
    return paginate<Master>(query, options);
  }
}
