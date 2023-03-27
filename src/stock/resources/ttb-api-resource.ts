import { Expose, Type } from 'class-transformer';
import { CustomerApiResource } from 'src/customers/resources/customer-api-resource';
import { CustomerServiceApiResource } from 'src/customers/resources/customer-service-api-resource';
import { LiteEmployeeApiResource } from 'src/employees/resources/lite-employee-api-resource';
import { ServiceApiResource } from 'src/services/resources/service-api-resource';

export class TtbApiResource {
  @Expose()
  id: number;

  @Expose({ name: 'ticket_id' })
  ticketId: number;

  @Expose({ name: 'no_surat' })
  noSurat: number;

  @Expose({ name: 'branch_id' })
  branchId: string;

  @Expose()
  date: string;

  @Expose()
  setup: boolean;

  @Expose()
  description: string;

  @Expose()
  @Type(() => CustomerApiResource)
  customer: CustomerApiResource;

  @Expose({ name: 'customer_service' })
  @Type(() => CustomerServiceApiResource)
  customerService: CustomerServiceApiResource;

  @Expose()
  @Type(() => ServiceApiResource)
  service: ServiceApiResource;

  @Expose({ name: 'approved_date' })
  approvedDate: string;

  @Expose()
  @Type(() => LiteEmployeeApiResource)
  approved: LiteEmployeeApiResource;

  @Expose()
  @Type(() => LiteEmployeeApiResource)
  sales: LiteEmployeeApiResource;

  @Expose()
  @Type(() => LiteEmployeeApiResource)
  engineer: LiteEmployeeApiResource;
}
