import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'StockInvoice', synchronize: false })
export class StockInvoice extends BaseEntity {
  @PrimaryColumn()
  No: number;
}
