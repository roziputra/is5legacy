import { Exclude, Expose, Type } from 'class-transformer';
import { MasterApiResource } from './master-api-resource';
import { BoxApiResource } from './box-api-resource';

export class RequestStbPackageDetailApiResource {
  @Expose()
  id: number;

  @Expose({ name: 'name' })
  getMasterName() {
    if (!this.master) console.log('master', this.id);
    return this.master?.name;
  }

  @Expose({ name: 'unit' })
  getBoxName() {
    if (!this.unit) console.log('unit', this.id);
    return this.unit?.name;
  }

  @Expose()
  code: string;

  @Expose()
  qty: number;

  @Exclude()
  @Type(() => MasterApiResource)
  master: MasterApiResource;

  @Exclude()
  @Type(() => BoxApiResource)
  unit: BoxApiResource;
}
