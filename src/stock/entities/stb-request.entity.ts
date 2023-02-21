import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StbEngineerDetail } from './stb-engineer-detail.entity';

@Entity({ name: 'stb_request', synchronize: false })
export class StbRequest extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'related_id' })
  relatedId: number;

  @Column()
  engineer: string;

  @Column({ name: 'branch_id' })
  branchId: string;

  @Column({ name: 'request_type' })
  requestType: RequestType;

  @Column({ name: 'request_date' })
  requestDate: Date;

  @Column()
  status: string;

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

  @OneToMany(() => StbEngineerDetail, (stb) => stb.stbEngineer)
  details: StbEngineerDetail[];

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

export const TYPE_REQUESTED = 'permintaan';
export const TYPE_RETURNED = 'pengembalian';
export const TYPE_MOVED = 'pindah';

export type Status = typeof STATUS_ACCEPTED | typeof STATUS_REJECTED;
export const STATUS_ACCEPTED = 'diterima';
export const STATUS_REJECTED = 'ditolak';
