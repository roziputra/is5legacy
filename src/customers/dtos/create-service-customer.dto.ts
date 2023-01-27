import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNewServiceCustomersDto {
  @IsNotEmpty()
  @IsString()
  installationAddress: string;

  @IsNotEmpty()
  @IsString()
  installationAddressCity: string;

  @IsNotEmpty()
  @IsString()
  installationAddressZipCode: string;

  @IsNotEmpty()
  @IsString()
  package_code: string;

  @IsNotEmpty()
  @IsString()
  packageName: string;

  @IsNotEmpty()
  @IsString()
  packagePrice: string;

  @IsNotEmpty()
  @IsString()
  packageTop: string;

  @IsNotEmpty()
  @IsString()
  PPN: string;

  @IsOptional()
  promoId: string;

  @IsNotEmpty()
  @IsString()
  salesId: string;

  @IsNotEmpty()
  @IsString()
  managerSalesId: string;

  @IsNotEmpty()
  @IsString()
  extendNote: string;

  @IsNotEmpty()
  @IsString()
  approvalEmpId: string;
}
