import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'CustomerInvoicePDF', synchronize: false })
export class CustomerInvoicePDF extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  hash: string;

  @Column()
  source: string;

  @Column()
  params: string;

  @Column()
  insertBy: string;

  @Column()
  insertTime: Date;
}
