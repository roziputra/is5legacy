import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CustomerTemp } from '../entities/customer-temp.entity';

@Injectable()
export class CustomerTempRepository extends Repository<CustomerTemp> {
  constructor(private dataSource: DataSource) {
    super(CustomerTemp, dataSource.createEntityManager());
  }

  async assignCustomerTemp(custId: string): Promise<CustomerTemp> {
    const findCustomerID = await CustomerTemp.findOne({
      where: {
        CustId: custId,
      },
    });
    findCustomerID.Taken = 1;

    return findCustomerID;
  }
}
