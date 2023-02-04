import { BaseEntity, Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'CustomerTemp', synchronize: false })
export class CustomerTemp extends BaseEntity {
  @PrimaryColumn()
  CustId: string;

  @Column()
  Taken: number;
}