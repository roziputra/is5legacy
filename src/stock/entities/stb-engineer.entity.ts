import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StbEngineerBarang } from './stb-engineer-barang.entity';

@Entity({ name: 'stb_engineer', synchronize: false })
export class StbEngineer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'no_surat' })
  noSurat: string;

  @Column()
  engineer: string;

  @Column({ name: 'request_type' })
  requestType: RequestType;

  @Column({ name: 'request_date' })
  requestDate: Date;

  @Column()
  status: Status;

  @Column({ name: 'approved_by' })
  approvedBy: string;

  @Column({ name: 'rejected_reason' })
  rejectedReason: string;

  @Column()
  description: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany((type) => StbEngineerBarang, (stb) => stb.stbEngineer)
  barangs: StbEngineerBarang[];

  @BeforeInsert()
  createDates() {
    const nowDate = new Date();
    this.createdAt = nowDate;
    this.updatedAt = nowDate;
  }

  @BeforeUpdate()
  updateDates() {
    this.updatedAt = new Date();
  }
}

export type RequestType =
  | typeof TYPE_REQUESTED
  | typeof TYPE_RETURNED
  | typeof TYPE_MOVED;

export const TYPE_REQUESTED = 'requested';
export const TYPE_RETURNED = 'returned';
export const TYPE_MOVED = 'pindah';

export type Status = typeof STATUS_ACCEPTED | typeof STATUS_REJECTED;
export const STATUS_ACCEPTED = 'diterima';
export const STATUS_REJECTED = 'ditolak';
