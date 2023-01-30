import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'CustomerVerifiedEmail', synchronize: false })
export class CustomerVerifiedEmail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  cust_id: string;

  @Column()
  cust_email: string;

  @Column()
  email_type: string;

  @Column()
  verified: string;
}
