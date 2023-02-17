import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RequestStbPackage } from './request-stb-package.entity';

@Entity({ name: 'request_spmb_package_detail', synchronize: false })
export class RequestStbPackageDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'package_id' })
  requestStbPackageId: number;

  @Column()
  code: string;

  @Column()
  qty: number;

  @ManyToOne(() => RequestStbPackage)
  @JoinColumn({ name: 'package_id' })
  package: RequestStbPackage;
}
