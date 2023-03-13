import { Repository, DataSource } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { Subscription } from '../entities/subscriber.entity';
import { CustomerServiceTechnicalCustom } from '../entities/customer-service-technical-custom.entity';
import { NOCFiber } from '../entities/noc-fiber.entity';
import { Injectable } from '@nestjs/common';
import { CustomerTemp } from '../entities/customer-temp.entity';
import { CustomerSalutation } from '../entities/salutation.entity';
import { Is5LegacyException } from 'src/exceptions/is5-legacy.exception';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class CustomerRepository extends Repository<Customer> {
  constructor(private dataSource: DataSource) {
    super(Customer, dataSource.createEntityManager());
  }

  async getCustomerSalutationRepository(salutationIds: string[]): Promise<any> {
    const querySalutationList = await CustomerSalutation.createQueryBuilder(
      'tcs',
    )
      .select(['tcs.id id', 'tcs.salutation salutation', 'tcs.status status'])
      .where('tcs.id IN (:...salutationIds)', {
        salutationIds: salutationIds,
      })
      .getRawMany();

    if (querySalutationList.length == 0) {
      throw new Is5LegacyException('Data salutation tidak ditemukan', 404);
    }

    return querySalutationList;
  }

  async getCustomerListRepository(
    options: IPaginationOptions,
    customerIds: string[],
  ): Promise<any> {
    const queryBuilder = this.createQueryBuilder('c')
      .innerJoinAndSelect('c.ListOfService', 'ListOfService')
      .innerJoinAndSelect('c.ListPhonebook', 'ListPhonebook')
      .innerJoinAndSelect('c.ListNPWP', 'ListNPWP')
      .innerJoinAndSelect('ListOfService.typeMonth', 'InvoiceDetails');

    if (customerIds.length > 0) {
      queryBuilder.where('c.CustId IN (:...customerIds)', {
        customerIds: customerIds,
      });
    }

    queryBuilder.orderBy('c.CustId', 'DESC');

    const pagination = await paginate<Customer>(queryBuilder, options);
    const newPaginationResult = {
      data: [],
      meta: pagination.meta,
      links: pagination.links,
    };
    pagination.items.forEach((obj, key) => {
      newPaginationResult.data[key] =
        Customer.transformQueryBuilderCustomer(obj);
    });

    return newPaginationResult;
  }

  async getNewCustomerId(): Promise<any> {
    let custIdResult = null;

    custIdResult = await CustomerTemp.findOne({
      where: {
        Taken: 0,
      },
    });

    return custIdResult;
  }

  async getLastFormId(branchId: string): Promise<any> {
    let formIdResult = null;

    // Step 1 : Ambil Data dari CustomerTemp
    const fetchDataCustomerLast = await this.createQueryBuilder('c')
      .select('c.FormId FormId')
      .where('IFNULL(c.DisplayBranchId, c.BranchId) = :branchId', {
        branchId: branchId,
      })
      .orderBy('c.CustId', 'DESC')
      .limit(1)
      .getRawMany();

    formIdResult = fetchDataCustomerLast[0].FormId;

    return formIdResult;
  }

  async checkAccountName(accName: string): Promise<Subscription[]> {
    return await Subscription.find({
      where: {
        CustAccName: accName,
      },
    });
  }

  getNocFiberId(branchIds: string[], vendorIds: number[]) {
    return NOCFiber.createQueryBuilder('f')
      .select(['f.id'])
      .where('f.branchId IN (:...branchIds)', { branchIds: branchIds })
      .andWhere('f.vendorId IN (:...vendorIds)', { vendorIds: vendorIds })
      .getMany();
  }

  getOperatorSubscriptions(NocFiberId: number[], status: string[]) {
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
}

export const CUSTOMER_DEFAULT_BUSINESS_TYPE_ID = '090';
export const DEFAULT_FACTOR_GENERATE_CUSTOMER_ID = '298765432';
export const CUSTOMER_BILLING_ADD = true;
export const CUSTOMER_BILLING_METHOD = {
  letter: false,
  email: true,
};
export const CUSTOMER_DEFAULT_STATUS = 'AC';
