import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TtbCustomerDetail } from '../entities/ttb-customer-detail.entity';
import { TtbCustomer } from '../entities/ttb-customer.entity';
import { Master } from '../entities/master.entity';

@Injectable()
export class TtbCustomerDetailRepository extends Repository<TtbCustomerDetail> {
  constructor(private dataSource: DataSource) {
    super(TtbCustomerDetail, dataSource.createEntityManager());
  }

  findAllDetails(id: number): Promise<any> {
    return this.createQueryBuilder('d')
      .select([
        'd.id id',
        'm.name name',
        'd.serial serial',
        'd.code code',
        'd.qty qty',
        'd.unit unit',
        'd.status status',
      ])
      .leftJoin(TtbCustomer, 'ttb', 'ttb.id = d.ttbCustomerId')
      .leftJoin(Master, 'm', 'm.code = d.code and m.branchId = ttb.branchId')
      .where('d.ttbCustomerId = :id', {
        id: id,
      })
      .getRawMany();
  }
}
