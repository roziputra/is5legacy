import { Injectable } from '@nestjs/common';
import { FiberVendorServicesRepository } from './repositories/fiber-vendor-services.repository';
import { DataSource } from 'typeorm';
import { GetOperatorSubscriptionDto } from './dtos/get-operator-subscription.dto';
import { OperatorSubscriptionRepository } from './repositories/operator-subscription.repository';
import { NOCFiberRepository } from './repositories/noc-fiber.repository';
import {
  FiberVendorServices,
  TYPE_CUSTOMER_SERVICES,
} from './entities/fiber-vendor-services.entity';
import { CreateOperatorSubscriptionDto } from './dtos/create-operator-subscription.dto';

@Injectable()
export class OperatorSubscriptionService {
  constructor(
    private fiberVendorServiceRepository: FiberVendorServicesRepository,
    private operatorSubscriptionRepository: OperatorSubscriptionRepository,
    private nocFiberRepository: NOCFiberRepository,
    private dataSource: DataSource,
  ) {}

  async saveDataFromGoogleSheet(
    createOperatorSubscriptionDto: CreateOperatorSubscriptionDto,
  ): Promise<any> {
    const { nsn, vendorCid, vendorId, tagihan } = createOperatorSubscriptionDto;

    let dataVendorServices: any;
    if (nsn) {
      dataVendorServices =
        await this.fiberVendorServiceRepository.findCustomerFiberVendorServices(
          nsn,
          vendorId,
        );
      if (dataVendorServices) {
        dataVendorServices.vendorCid = vendorCid;
        dataVendorServices.tagihan = tagihan;
      } else {
        dataVendorServices =
          await this.fiberVendorServiceRepository.findCustomerFiberVendorServices(
            vendorCid,
            vendorId,
          );
        if (dataVendorServices) {
          dataVendorServices.tagihan = tagihan;
        }
      }
    } else {
      dataVendorServices =
        await this.fiberVendorServiceRepository.findCustomerFiberVendorServices(
          vendorCid,
          vendorId,
        );
      if (dataVendorServices) {
        dataVendorServices.tagihan = tagihan;
      }
    }

    if (dataVendorServices) {
      const cstcData =
        this.operatorSubscriptionRepository.findCustomerFiberVendorServices(
          dataVendorServices.vendorCid,
          dataVendorServices.vendorId,
        );

      if (cstcData) {
        dataVendorServices.type = TYPE_CUSTOMER_SERVICES;
        dataVendorServices.typeId = cstcData['custServId'];
        dataVendorServices.vendorId = vendorId;
        dataVendorServices.name = cstcData['custAccName'];
        const saved = await this.fiberVendorServiceRepository.save(
          dataVendorServices,
        );
        return `data ${saved.id} updated`;
      }
    }

    return 'cid not found';
  }

  create(data: FiberVendorServices): Promise<FiberVendorServices> {
    return this.fiberVendorServiceRepository.save(data);
  }

  async remove(id: number): Promise<FiberVendorServices> {
    const datum = await this.fiberVendorServiceRepository.findOneBy({ id: id });
    return this.fiberVendorServiceRepository.remove(datum);
  }

  findAll(): Promise<any> {
    return this.fiberVendorServiceRepository.findAllCustomerFiberVendorServices();
  }

  async getOperatorSubscriptions(
    getOperatorSubscriptionDto: GetOperatorSubscriptionDto,
  ): Promise<any> {
    const { branchIds, status, vendorIds } = getOperatorSubscriptionDto;
    const nocFiberIds = await this.nocFiberRepository.getNocFiberId(
      branchIds,
      vendorIds,
    );
    const ArrayNocFiberIds = nocFiberIds.map((item) => item.id);
    return this.operatorSubscriptionRepository.getOperatorSubscription(
      ArrayNocFiberIds,
      status,
    );
  }
}
