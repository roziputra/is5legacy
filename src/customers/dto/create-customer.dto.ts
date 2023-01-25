import { IsBoolean, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNewCustomerDto {
  @IsNotEmpty()
  @IsString()
  branch_id: string;

  @IsOptional()
  display_branch_id: string;

  @IsNotEmpty()
  @IsString()
  full_name: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  place_of_birth: string;

  @IsNotEmpty()
  @IsString()
  date_of_birth: string;

  @IsNotEmpty()
  @IsString()
  email_address: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  installation_address: string;

  @IsNotEmpty()
  @IsString()
  identity_type: string;

  @IsNotEmpty()
  @IsString()
  identity_number: string;

  @IsNotEmpty()
  @IsString()
  identity_address: string;

  @IsOptional()
  company_name: string;

  @IsOptional()
  company_address: string;

  @IsOptional()
  company_phone_number: string;

  @IsNotEmpty()
  @IsString()
  billing_salutation: string;

  @IsNotEmpty()
  @IsString()
  billing_name: string;

  @IsNotEmpty()
  @IsString()
  billing_email: string;

  @IsNotEmpty()
  @IsString()
  technical_salutation: string;

  @IsNotEmpty()
  @IsString()
  technical_name: string;

  @IsNotEmpty()
  @IsString()
  technical_email: string;

  @IsNotEmpty()
  @IsString()
  billing_phone: string;

  @IsNotEmpty()
  @IsString()
  technical_phone: string;

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

  @IsOptional()
  @IsString()
  npwp_number: string;

  @IsNotEmpty()
  @IsBoolean()
  tax_type: boolean;

  @IsNotEmpty()
  @IsBoolean()
  cetak_duluan: boolean;
}
