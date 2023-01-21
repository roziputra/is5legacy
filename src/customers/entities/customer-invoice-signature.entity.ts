import { BaseEntity, Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'CustomerInvoiceSignature', synchronize: false })
export class CustomerInvoiceSignature extends BaseEntity {
  @PrimaryColumn()
  CustId: string;

  @Column()
  UseSignature: string;

  @Column()
  Mark: string;
}
