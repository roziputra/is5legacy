import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'CustomerGlobalSearch', synchronize: false })
export class CustomerGlobalSearch extends BaseEntity {
  @PrimaryColumn()
  custId: string;

  @Column()
  textSearch: string;
}
