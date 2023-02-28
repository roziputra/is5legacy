import { Injectable } from '@nestjs/common';
import { FiberVendorServicesRepository } from './repositories/fiber-vendor-services.repository';
import { DataSource } from 'typeorm';
import { GetOperatorSubscriptionDto } from './dtos/get-operator-subscription.dto';
import { OperatorSubscriptionRepository } from './repositories/operator-subscription.repository';
import { NOCFiberRepository } from './repositories/noc-fiber.repository';
import { FiberVendorServices } from './entities/fiber-vendor-services.entity';
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
    const { nsn, vendorCid, type, vendorId, tagihan } =
      createOperatorSubscriptionDto;

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

    if (!dataVendorServices) {
      const insertData = new FiberVendorServices();
      insertData.vendorId = vendorId;
      insertData.vendorCid = vendorCid;
      insertData.tagihan = tagihan;
      insertData.type = type;
      insertData.typeId = 0;
      insertData.name = '';
      insertData.capacity = '';
      const saved = await this.fiberVendorServiceRepository.save(insertData);
      return `data ${saved.id} created`;
    } else {
      const saved = await this.fiberVendorServiceRepository.save(
        dataVendorServices,
      );
      return `data ${saved.id} updated`;
    }
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
