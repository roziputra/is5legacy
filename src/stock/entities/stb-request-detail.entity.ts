import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StbRequest } from './stb-request.entity';
import { Expose } from 'class-transformer';

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

  @ManyToOne(() => StbRequest)
  @JoinColumn({ name: 'stb_request_id' })
  stbRequest: StbRequest;
}
