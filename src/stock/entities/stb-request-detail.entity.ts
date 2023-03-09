import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StbRequest } from './stb-request.entity';
import { Expose } from 'class-transformer';
import { Master } from './master.entity';

@Entity({ name: 'stb_request_detail', synchronize: false })
export class StbRequestDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'stb_request_id' })
  @Expose({ name: 'stb_request_id' })
  stbRequestId: number;

  @Column()
  serial: string;

  @Column()
  code: string;

  @Column()
  qty: number;

  @Column()
  unit: string;

  @OneToOne(() => Master, (m) => m.detail) // specify inverse side as a second parameter
  master: Master;

  @ManyToOne(() => StbRequest)
  @JoinColumn({ name: 'stb_request_id' })
  stbRequest: StbRequest;
}
