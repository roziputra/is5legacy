import { Expose, Type } from 'class-transformer';
import { LiteEmployeeApiResource } from 'src/employees/resources/lite-employee-api-resource';
import { RequestType } from '../entities/stb-request.entity';

export class StbApiResource {
  @Expose()
  id: number;

  @Expose({ name: 'no_surat' })
  noSurat: number;

  @Expose({ name: 'engineer' })
  @Type(() => LiteEmployeeApiResource)
  eng: LiteEmployeeApiResource;

  @Expose({ name: 'branch_id' })
  branchId: string;

  @Expose({ name: 'request_type' })
  requestType: RequestType;

  @Expose({ name: 'is_draft' })
  isDraft: boolean;

  @Expose({ name: 'approved_date' })
  approvedDate: Date;

  @Expose({ name: 'approved_by' })
  @Type(() => LiteEmployeeApiResource)
  app: LiteEmployeeApiResource;

  @Expose()
  description: string;

  @Expose({ name: 'created_by' })
  @Type(() => LiteEmployeeApiResource)
  cre: LiteEmployeeApiResource;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
