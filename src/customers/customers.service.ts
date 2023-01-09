import { Injectable } from '@nestjs/common';
import { CustomerRepository } from './repositories/customers.repository';
import { GetOperatorSubscriptionDto } from './dto/get-operator-subscription.dto';
import { NOCFiberRepository } from 'src/customers/repositories/noc-fiber.repository';
import { OperatorSubscriptionRepository } from './repositories/operator-subscription.repository';
import { CreateNewCustomerDto } from './dto/create-customer.dto';
import { CreateNewServiceCustomersDto } from './dto/create-service-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    private customerRepository: CustomerRepository,
    private operatorSubscription: OperatorSubscriptionRepository,
    private nocFiberRepository: NOCFiberRepository,
  ) {}

  async getOperatorSubscriptions(
    getOperatorSubscriptionDto: GetOperatorSubscriptionDto,
  ): Promise<any> {
    const { branchIds, status, vendorIds } = getOperatorSubscriptionDto;
    const NocFiberIds = await this.nocFiberRepository.getNocFiberId(
      branchIds,
      vendorIds,
    );
    const ArrayNocFiberIds = NocFiberIds.map((item) => item.id);
    return this.operatorSubscription.getOperatorSubscription(
      ArrayNocFiberIds,
      status,
    );
  }

  async getCustomerServices(customerId) {
    return await this.customerRepository.getCustomerRepository(customerId);
  }

  async saveNewCustomerServices(
    createNewCustomerDto: CreateNewCustomerDto,
  ): Promise<any> {
    return await this.customerRepository.saveNewCustomerRepositories(
      createNewCustomerDto,
    );
  }

  async saveNewCustomerServiceServices(
    createNewServiceCustDto: CreateNewServiceCustomersDto,
    cust_id: string,
  ): Promise<any> {
    return await this.customerRepository.saveCustomerServiceRepository(
      createNewServiceCustDto,
      cust_id,
    );
  }
}
