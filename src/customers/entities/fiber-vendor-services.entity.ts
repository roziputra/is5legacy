import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'FiberVendorServices', synchronize: false })
export class FiberVendorServices extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: ['POP', 'CustomerServices'] })
  type: ServiceType;

  @Column()
  typeId: number;

  @Column({ name: 'vendor_id' })
  vendorId: number;

  @Column({ name: 'vendor_cid' })
  vendorCid: string;

  @Column()
  name: string;

  @Column()
  capacity: string;

  @Column({ name: 'periode_tagihan' })
  periodeTagihan: string;

  @Column({ name: 'tanggal_aktivasi' })
  tanggalAktivasi: Date;

  @Column({ name: 'tagihan_otc' })
  tagihanOtc: number;

  @Column()
  tagihan: number;

  @Column()
  show: boolean;

  @Column()
  hide_date: Date;
}

export const TYPE_POP = 'POP';
export const TYPE_CUSTOMER_SERVICES = 'CustomerServices';
export type ServiceType = typeof TYPE_POP | typeof TYPE_CUSTOMER_SERVICES;
