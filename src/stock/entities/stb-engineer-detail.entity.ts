import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StbEngineer } from './stb-engineer.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'stb_engineer_detail', synchronize: false })
export class StbEngineerDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stb_engineer_id' })
  @Expose({ name: 'stb_engineer_id' })
  stbEngineerId: number;

  @Column()
  serial: string;

  @Column()
  code: string;

  @Column()
  qty: number;

  @Column()
  unit: string;

  @ManyToOne(() => StbEngineer)
  @JoinColumn({ name: 'stb_engineer_id' })
  stbEngineer: StbEngineer;
}
