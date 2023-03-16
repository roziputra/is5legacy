import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TtbStatus } from '../entities/ttb-customer-detail.entity';
import { Type } from 'class-transformer';

export class CreateTtbCustomerDetailDto {
  @IsNotEmpty()
  @IsString()
  serial: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  qty: number;

  @IsOptional()
  @IsString()
  unit: string;

  @IsNotEmpty()
  @IsString()
  status: TtbStatus;
}
