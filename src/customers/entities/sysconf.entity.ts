import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'SysConf', synchronize: false })
export class CustomerSysConf extends BaseEntity {
  @PrimaryColumn()
  LastRec: string;

  @PrimaryColumn()
  BranchId: string;
}
