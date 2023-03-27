import { Expose } from 'class-transformer';

export class MasterApiResource {
  @Expose()
  code: string;

  @Expose({ name: 'master_type' })
  masterType: string;

  @Expose({ name: 'branch_id' })
  branchId: string;

  @Expose()
  name: string;

  @Expose({ name: 'is_active' })
  isActive: number;

  @Expose({ name: 'insert_date' })
  insertDate: Date;
}
