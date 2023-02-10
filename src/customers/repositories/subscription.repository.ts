import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Subscription } from '../entities/subscriber.entity';

@Injectable()
export class SubscriptionRepository extends Repository<Subscription> {
  constructor(private dataSource: DataSource) {
    super(Subscription, dataSource.manager);
  }

  async findSubscriptionWithRelation(customerServiceId) {
    return this.findOne({
      where: {
        id: customerServiceId,
      },
      relations: { customer: true, service: true, typeMonth: true },
    });
  }
}
