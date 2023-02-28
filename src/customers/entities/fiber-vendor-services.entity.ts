import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'FiberVendorServices', synchronize: false })
export class FiberVendorServices extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: ['POP', 'CustomerServices'], default: null })
  type: ServiceType;

  @Column({ default: null })
  typeId: number;

  @Column({ name: 'vendor_id' })
  vendorId: number;

  @Column({ name: 'vendor_cid' })
  vendorCid: string;

  @Column()
  name: string;

  @Column({ default: null })
  capacity: string;

  @Column()
  tagihan: number;
}

export const TYPE_POP = 'POP';
export const TYPE_CUSTOMER_SERVICES = 'CustomerServices';
export type ServiceType = typeof TYPE_POP | typeof TYPE_CUSTOMER_SERVICES;
