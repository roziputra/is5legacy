import { Expose, Type } from 'class-transformer';
import { LiteEmployeeApiResource } from 'src/employees/resources/lite-employee-api-resource';
import { RequestStbPackageDetailApiResource } from './request-stb-package-detail-api-resource';

export class RequestStbPackageApiResource {
  @Expose()
  id: number;

  @Expose()
  title: number;

  @Expose()
  description: string;

  @Expose({ name: 'insert_time' })
  insertTime: Date;

  @Expose({ name: 'insert_by' })
  @Type(() => LiteEmployeeApiResource)
  insertBy: LiteEmployeeApiResource;

  @Expose()
  @Type(() => RequestStbPackageDetailApiResource)
  details: RequestStbPackageDetailApiResource[];
}
