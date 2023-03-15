import { Expose } from 'class-transformer';

export class ServiceApiResource {
  @Expose()
  id: string;

  @Expose({ name: 'service_type' })
  ServiceType: string;
}
