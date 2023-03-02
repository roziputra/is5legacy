import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('SalesPromo', { synchronize: false })
export class SalesPromo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  branchId: string;

  @Column({
    type: 'char',
    length: 3,
  })
  nama_promo: string;

  @Column({ type: 'date' })
  from: Date;

  @Column({ type: 'date' })
  to: Date;

  @Column({
    type: 'longtext',
  })
  description: string;

  @Column()
  active: boolean;

  @Column({
    type: 'timestamp',
  })
  inserttime: Date;

  @Column()
  insertby: string;
}
