import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNewServiceCustomersDto {
  @IsNotEmpty()
  @IsString()
  installation_address: string;

  @IsNotEmpty()
  @IsString()
  installation_address_city: string;

  @IsNotEmpty()
  @IsString()
  installation_address_zip_code: string;

  @IsNotEmpty()
  @IsString()
  package_code: string;

  @IsNotEmpty()
  @IsString()
  package_name: string;

  @IsNotEmpty()
  @IsString()
  package_price: string;

  @IsNotEmpty()
  @IsString()
  package_top: string;

  @IsNotEmpty()
  @IsString()
  PPN: string;

  @IsOptional()
  promo_id: string;

  @IsNotEmpty()
  @IsString()
  sales_id: string;

  @IsNotEmpty()
  @IsString()
  manager_sales_id: string;

  @IsNotEmpty()
  @IsString()
  extend_note: string;

  @IsNotEmpty()
  @IsString()
  approval_emp_id: string;
}
