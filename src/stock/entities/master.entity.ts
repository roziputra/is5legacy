import { Expose } from 'class-transformer';
import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Box } from './box.entity';

@Entity({ name: 'Master', synchronize: false })
export class Master extends BaseEntity {
  @PrimaryColumn({ name: 'Code' })
  code: string;

  @Column({ name: 'Type' })
  @Expose({ name: 'master_type' })
  masterType: string;

  @Column({ name: 'Branch' })
  @Expose({ name: 'branch_id' })
  branchId: string;

  @Column({ name: 'Name' })
  name: string;

  @Column()
  @Expose({ name: 'is_active' })
  isActive: number;

  @Column({ name: 'InsertDate' })
  @Expose({ name: 'insert_date' })
  insertDate: Date;

  @OneToMany(() => Box, (b) => b.master)
  units: Box[];
}

export const BRANCH_MEDAN = '020';
export const IS_ACTIVE_TRUE = 1;
