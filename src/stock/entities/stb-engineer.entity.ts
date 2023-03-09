import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StbEngineerDetail } from './stb-engineer-detail.entity';
import { StbRequest } from './stb-request.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'stb_engineer', synchronize: false })
export class StbEngineer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'request_id' })
  @Expose({ name: 'request_id' })
  requestId: number;

  @Column({ name: 'no_surat' })
  @Expose({ name: 'no_surat' })
  noSurat: string;

  @Column()
  engineer: string;

  @Column({ name: 'branch_id' })
  @Expose({ name: 'branch_id' })
  branchId: string;

  @Column({ name: 'request_type' })
  @Expose({ name: 'request_type' })
  requestType: RequestType;

  @Column({ name: 'is_draft' })
  @Expose({ name: 'is_draft' })
  isDraft: boolean;

  @Column({ name: 'approved_by' })
  @Expose({ name: 'approved_by' })
  approvedBy: string;

  @Column({ name: 'approved_date' })
  @Expose({ name: 'approved_date' })
  approvedDate: Date;

  @Column()
  description: string;

  @Column({ name: 'created_by' })
  @Expose({ name: 'created_by' })
  createdBy: string;

  @Column({ name: 'created_at' })
  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => StbRequest)
  @JoinColumn({ name: 'request_id' })
  stbRequest: StbRequest;

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

export type TransferType =
  | typeof TRANSFER_TYPE_ACCEPT
  | typeof TRANSFER_TYPE_REQUEST;

export const TRANSFER_TYPE_REQUEST = 'permintaan';
export const TRANSFER_TYPE_ACCEPT = 'penerimaan';
