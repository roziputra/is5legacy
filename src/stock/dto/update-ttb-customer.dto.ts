import { PartialType } from '@nestjs/mapped-types';
import { CreateTtbCustomerDto } from './create-ttb-customer.dto';

export class UpdateTtbCustomerDto extends PartialType(CreateTtbCustomerDto) {}
