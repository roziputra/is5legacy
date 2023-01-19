import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'GeneralJournal', synchronize: false })
export class GeneralJournal extends BaseEntity {
  @PrimaryColumn()
  NoBatch: number;

  @Column()
  KodeCabang: string;

  @Column()
  TglTransaksi: string;

  @Column()
  NoPerkiraan: string;

  @Column()
  Keterangan: string;

  @Column()
  Debet: number;

  @Column()
  Kredit: number;

  @Column()
  FlagAcctApproval: number;

  @Column()
  Sumber: string;

  @Column()
  SumberId: string;

  @Column()
  Tipe: string;

  @Column()
  TglHistory: string;

  @Column()
  AI: number;

  @PrimaryGeneratedColumn()
  NoUrut: number;

  @Column()
  DateTime: string;
}
