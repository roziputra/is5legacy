import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { TtbStatus } from '../entities/ttb-customer-detail.entity';

export class CreateTtbCustomerDetailDto {
  @IsNotEmpty()
  @IsString()
  serial: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  qty: number;

  @IsOptional()
  @IsString()
  unit: string;

  @IsNotEmpty()
  @IsString()
  status: TtbStatus;
}
