import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'CustomerServiceTechnicalCustom', synchronize: false })
export class CustomerServiceTechnicalCustom extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  value: string;

  @Column()
  technicalTypeId: number;
}

export const ATTRIBUTE_VENDOR_CID = 'Vendor CID';
