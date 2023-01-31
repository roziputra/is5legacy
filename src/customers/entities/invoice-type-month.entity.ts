import { Entity, BaseEntity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'InvoiceTypeMonth', synchronize: false })
export class InvoiceTypeMonth extends BaseEntity {
  @PrimaryColumn()
  InvoiceType: number;

  @Column()
  Month: number;
}
