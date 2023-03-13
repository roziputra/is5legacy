import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RequestStbPackageDetail } from './request-stb-package-detail.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'request_spmb_package', synchronize: false })
export class RequestStbPackage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'insert_by' })
  @Expose({ name: 'insert_by' })
  insertBy: string;

  @Column({ name: 'insert_time' })
  @Expose({ name: 'insert_time' })
  insertTime: Date;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(() => RequestStbPackageDetail, (detail) => detail.package)
  details: RequestStbPackageDetail;
}
