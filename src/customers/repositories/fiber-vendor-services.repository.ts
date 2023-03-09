import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import {
  FiberVendorServices,
  TYPE_CUSTOMER_SERVICES,
} from '../entities/fiber-vendor-services.entity';

@Injectable()
export class FiberVendorServicesRepository extends Repository<FiberVendorServices> {
  constructor(private dataSource: DataSource) {
    super(FiberVendorServices, dataSource.createEntityManager());
  }

  findAllFiberVendorService(): Promise<any> {
    return this.createQueryBuilder('f')
      .select([
        'c.custServId id',
        'c.CustAccName acc',
        'vendor_cid vendorCid',
        'name',
        'periode_tagihan periodeTagihan',
        'tagihan',
        'c.CustStatus status',
      ])
      .leftJoin('CustomerServices', 'c', 'c.custServId = f.typeId')
      .where('f.type = :type', { type: TYPE_CUSTOMER_SERVICES })
      .getRawMany();
  }
}
