import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'CustomerTemp', synchronize: false })
export class CustomerTemp extends BaseEntity {
  @PrimaryColumn()
  CustId: string;

  @Column()
  Taken: number;

  @Column()
  InsertBy: string;

  @CreateDateColumn()
  InsertTime: Date;
}
