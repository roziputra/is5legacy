import { Expose, Type } from 'class-transformer';
import { LiteEmployeeApiResource } from 'src/employees/resources/lite-employee-api-resource';
import { RequestType } from '../entities/stb-request.entity';
import { StbApiResource } from './stb-api-resource';

export class StbRequestApiResource {
  @Expose()
  id: number;

  @Expose({ name: 'engineer' })
  @Type(() => LiteEmployeeApiResource)
  eng: LiteEmployeeApiResource;

  @Expose({ name: 'branch_id' })
  branchId: string;

  @Expose({ name: 'request_type' })
  requestType: RequestType;

  @Expose({ name: 'request_date' })
  requestDate: Date;

  @Expose()
  status: string;

  @Expose({ name: 'rejected_by' })
  @Type(() => LiteEmployeeApiResource)
  rej: LiteEmployeeApiResource;

  @Expose({ name: 'rejected_reason' })
  rejectedReason: string;

  @Expose()
  description: string;

  @Expose({ name: 'created_by' })
  @Type(() => LiteEmployeeApiResource)
  cre: LiteEmployeeApiResource;

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
