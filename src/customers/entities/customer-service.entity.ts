import {
  BaseEntity,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Services } from 'src/services/entities/service.entity';

@Entity({ name: 'CustomerServices', synchronize: false })
export class CustomerService extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'CustServId' })
  id: number;

  @OneToOne(() => Customer)
  @JoinColumn({ name: 'CustId', referencedColumnName: 'CustId' })
  customer: Customer;

  //   @OneToOne(() => Services)
  //   @JoinColumn({ name: 'ServiceId', referencedColumnName: 'ServiceId' })
  //   service: Customer;
}
