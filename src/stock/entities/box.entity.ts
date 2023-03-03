import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Master } from './master.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'Box', synchronize: false })
export class Box extends BaseEntity {
  @PrimaryColumn({ name: 'Code' })
  @Exclude()
  code: string;

  @Column({ name: 'Name' })
  name: string;

  @ManyToOne(() => Master)
  @JoinColumn({ name: 'Code', referencedColumnName: 'code' })
  master: Master;
}

export const BRANCH_MEDAN = '020';
