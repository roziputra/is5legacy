import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNewServiceCustomersDto {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'installation_address' })
  installationAddress: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'installation_address_city' })
  installationAddressCity: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'installation_address_zip_code' })
  installationAddressZipCode: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'package_code' })
  packageCode: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'package_name' })
  packageName: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'package_price' })
  packagePrice: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'package_top' })
  packageTop: string;

  @IsNotEmpty()
  @IsString()
  ppn: string;

  @IsOptional()
  @Expose({ name: 'promo_id' })
  promoId: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'first_invoice_period' })
  firstInvoicePeriod: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'contract_end' })
  contractEnd: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'sales_id' })
  salesId: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'manager_sales_id' })
  managerSalesId: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'surveyor_id' })
  surveyorId: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'extend_note' })
  extendNote: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'approval_emp_id' })
  approvalEmpId: string;
}
