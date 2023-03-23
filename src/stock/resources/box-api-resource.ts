import { Expose } from 'class-transformer';

export class BoxApiResource {
  @Expose()
  name: string;
}
