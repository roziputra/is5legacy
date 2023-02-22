import { Injectable } from '@nestjs/common';
import { FiberVendorServicesRepository } from './repositories/fiber-vendor-services.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class OperatorSubscriptionService {
  constructor(
    private fiberVendorServiceRepository: FiberVendorServicesRepository,
    private dataSource: DataSource,
  ) {}

  findAll(): Promise<any> {
    return this.fiberVendorServiceRepository.findAllFiberVendorService();
  }
}
