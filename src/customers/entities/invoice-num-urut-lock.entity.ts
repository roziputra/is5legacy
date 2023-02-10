import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'CustomerInvoiceNumUrutLock', synchronize: false })
export class InvoiceNumUrutLock extends BaseEntity {
  @PrimaryColumn({ name: 'InvoiceNum' })
  id: number;

  @Column({ name: 'Urut' })
  urut: number;
}
