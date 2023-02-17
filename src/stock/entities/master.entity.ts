import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Master', synchronize: false })
export class Master extends BaseEntity {
  @PrimaryColumn({ name: 'Code' })
  code: string;

  @Column({ name: 'Type' })
  masterType: string;

  @Column({ name: 'Branch' })
  branchId: string;

  @Column({ name: 'Name' })
  name: string;

  @Column()
  isActive: string;

  @Column({ name: 'InsertDate' })
  insertDate: Date;
}

export const BRANCH_MEDAN = '020';
