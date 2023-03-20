import { Expose, Type } from 'class-transformer';
import { EmployeeApiResource } from 'src/employees/resources/employee-api-resource';
import { RequestType } from '../entities/stb-request.entity';

export class StbApiResource {
  @Expose()
  id: number;

  @Expose({ name: 'no_surat' })
  noSurat: number;

  @Expose({ name: 'engineer' })
  @Type(() => EmployeeApiResource)
  eng: EmployeeApiResource;

  @Expose({ name: 'branch_id' })
  branchId: string;

  @Expose({ name: 'request_type' })
  requestType: RequestType;

  @Expose({ name: 'is_draft' })
  isDraft: boolean;

  @Expose({ name: 'approved_date' })
  approvedDate: Date;

  @Expose({ name: 'approved_by' })
  @Type(() => EmployeeApiResource)
  app: EmployeeApiResource;

  @Expose()
  description: string;

  @Expose({ name: 'created_by' })
  @Type(() => EmployeeApiResource)
  cre: EmployeeApiResource;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;
}
