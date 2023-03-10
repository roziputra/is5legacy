import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { CreateTtbCustomerDetailDto } from './create-ttb-customer-detail.dto';

export class CreateTtbCustomerDto {
  @IsNotEmpty()
  engineer: string;

  @IsNotEmpty()
  @Expose({ name: 'ticket_id' })
  ticketId: number;

  @IsNotEmpty()
  @Expose({ name: 'sales_id' })
  salesId: string;

  @IsNotEmpty()
  @Expose({ name: 'customer_service_id' })
  customerServiceId: number;

  @IsOptional()
  setup: boolean;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateTtbCustomerDetailDto)
  details: CreateTtbCustomerDetailDto[];
}
