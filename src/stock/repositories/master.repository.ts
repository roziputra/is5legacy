import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Repository } from 'typeorm';
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

    let query = this.createQueryBuilder('m')
      .select(['m.code', 'm.name'])
      .where('m.Branch = :branch', {
        branch: branch,
      })
      .andWhere('m.isActive = :isActive', { isActive: IS_ACTIVE_TRUE });

    if (search) {
      query = query.andWhere(
        new Brackets((q) => {
          q.where('m.name like :search', searchLike).orWhere(
            'm.code like :search',
            searchLike,
          );
        }),
      );
    }

    query.leftJoinAndMapMany('m.units', Box, 'b', 'b.Code = m.Code');
    return paginate<Master>(query, options);
  }
}
