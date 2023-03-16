import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ttb_customer_attachment', synchronize: false })
export class TtbCustomerAttachment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ttb_customer_id' })
  ttbCustomerId: number;

  @Column()
  filename: string;

  @Column()
  filepath: string;
}
