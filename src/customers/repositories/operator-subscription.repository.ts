import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import {
  ATTRIBUTE_VENDOR_CID,
  CustomerServiceTechnicalCustom,
} from '../entities/customer-service-technical-custom.entity';

@Injectable()
export class OperatorSubscriptionRepository extends Repository<CustomerServiceTechnicalCustom> {
  constructor(private dataSource: DataSource) {
    super(CustomerServiceTechnicalCustom, dataSource.createEntityManager());
  }

  getOperatorSubscription(NocFiberId: number[], status: string[]) {
    return CustomerServiceTechnicalCustom.createQueryBuilder('a')
      .select([
        'c.custServId id',
        'c.CustAccName acc',
        'a.value CID',
        'c.CustStatus status',
        'd.Month periode',
        'c.Subscription charge',
        'c.Discount discount',
        'c.CustActivationDate activationDate',
        'c.CustUnregDate unregDate',
        'c.CustBlockDate blockDate',
      ])
      .leftJoin('CustomerServiceTechnicalLink', 'b', 'b.id = a.technicalTypeId')
      .leftJoin('CustomerServices', 'c', 'c.custServId = b.custServId')
      .leftJoin('InvoiceTypeMonth', 'd', 'c.InvoiceType = d.InvoiceType')
      .where('a.attribute = :attribute', { attribute: 'Vendor CID' })
      .andWhere('c.CustStatus IN (:...custStatus)', { custStatus: status })
      .andWhere('b.foVendorId IN (:...foVendorId)', { foVendorId: NocFiberId })
      .getRawMany();
  }

  async findCustomerFiberVendorServices(vendorCid: string, vendorId: number) {
    return this.createQueryBuilder('tc')
      .select([
        'noc.vendorId vendorId',
        'tc.value vendorCid',
        'cs.CustAccName custAccName',
        'cs.custServId custServId',
      ])
      .leftJoin(
        'CustomerServiceTechnicalLink',
        'ln',
        'ln.id = tc.technicalTypeId',
      )
      .leftJoin('CustomerServices', 'cs', 'cs.custServId = ln.custServId')
      .leftJoin('noc_fiber', 'noc', 'noc.id = ln.foVendorId')
      .where('tc.attribute = :attribute', {
        attribute: ATTRIBUTE_VENDOR_CID,
      })
      .andWhere('tc.value = :vendorCid', { vendorCid: vendorCid })
      .andWhere('noc.vendorId = :vendorId', { vendorId: vendorId })
      .getRawOne();
  }
}
