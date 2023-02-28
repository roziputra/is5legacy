import { Injectable } from '@nestjs/common';
import { Repository, DataSource, Raw, SelectQueryBuilder } from 'typeorm';
import {
  FiberVendorServices,
  TYPE_CUSTOMER_SERVICES,
} from '../entities/fiber-vendor-services.entity';

@Injectable()
export class FiberVendorServicesRepository extends Repository<FiberVendorServices> {
  constructor(private dataSource: DataSource) {
    super(FiberVendorServices, dataSource.createEntityManager());
  }

  customerFiberVendorServicesQuery(): SelectQueryBuilder<FiberVendorServices> {
    return this.createQueryBuilder('fvs')
      .select([
        'fvs.id id',
        'fvs.type type',
        'fvs.typeId typeId',
        'fvs.vendor_id vendorId',
        'fvs.vendor_cid vendorCid',
        'fvs.name name',
        'cs.CustStatus status',
      ])
      .leftJoin('CustomerServices', 'cs', 'cs.CustServId = fvs.typeId')
      .where('fvs.type = :type', { type: TYPE_CUSTOMER_SERVICES });
  }

  findAllCustomerFiberVendorServices(): Promise<any> {
    return this.customerFiberVendorServicesQuery().getRawMany();
  }

  findCustomerFiberVendorServicesById(id: number): Promise<any> {
    return this.customerFiberVendorServicesQuery()
      .where('id = :id', {
        id: id,
      })
      .getRawOne();
  }

  findCustomerFiberVendorServices(
    vendorCid: string,
    vendorId: number,
  ): Promise<FiberVendorServices> {
    return this.customerFiberVendorServicesQuery()
      .where('vendor_cid = :vendorCid', {
        vendorCid: vendorCid,
      })
      .andWhere('vendor_id = :vendorId', {
        vendorId: vendorId,
      })
      .andWhere('fvs.type = :type', {
        type: TYPE_CUSTOMER_SERVICES,
      })
      .getRawOne();
  }

  findCustomerFiberVendorServicesByCID(vendorCid: string[]): Promise<any> {
    return this.customerFiberVendorServicesQuery()
      .where('vendor_cid in (:...vendorCid)', { vendorCid: vendorCid })
      .orderBy('vendor_cid', 'ASC')
      .getRawMany();
  }
}
