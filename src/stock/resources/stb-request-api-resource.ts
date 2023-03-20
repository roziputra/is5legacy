import { Expose, Type } from 'class-transformer';
import { EmployeeApiResource } from 'src/employees/resources/employee-api-resource';
import { RequestType } from '../entities/stb-request.entity';
import { StbApiResource } from './stb-api-resource';

export class StbRequestApiResource {
  @Expose()
  id: number;

  @Expose({ name: 'engineer' })
  @Type(() => EmployeeApiResource)
  eng: EmployeeApiResource;

  @Expose({ name: 'branch_id' })
  branchId: string;

  @Expose({ name: 'request_type' })
  requestType: RequestType;

  @Expose({ name: 'request_date' })
  requestDate: Date;

  @Expose()
  status: string;

  @Expose({ name: 'rejected_by' })
  @Type(() => EmployeeApiResource)
  rej: EmployeeApiResource;

  @Expose({ name: 'rejected_reason' })
  rejectedReason: string;

  @Expose()
  description: string;

  @Expose({ name: 'created_by' })
  @Type(() => EmployeeApiResource)
  cre: EmployeeApiResource;

  @Expose({ name: 'created_at' })
  createdAt: Date;

  @Expose({ name: 'updated_at' })
  updatedAt: Date;

  @Expose({ name: 'transfer_type' })
  transferType: string;

  @Expose()
  @Type(() => StbApiResource)
  stb: StbApiResource;
}
