import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'CustomerServicesHistoryNew', synchronize: false })
export class CustomerServicesHistoryNew extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cust_serv_id: string;

  @Column()
  emp_id: string;

  @Column()
  insert_time: Date;

  @Column()
  description: string;
}
