import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'GeneralJournalBatchNo', synchronize: false })
export class GeneralJournalBatchNo extends BaseEntity {
  @PrimaryGeneratedColumn()
  NoBatch: number;

  @Column()
  JournalAI: number;

  @Column()
  Sumber: string;

  @Column()
  SumberId: string;

  @Column()
  Source: string;
}
