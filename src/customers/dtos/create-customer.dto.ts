import { IsBoolean, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNewCustomerDto {
  @IsNotEmpty()
  @IsString()
  branchId: string;

  @IsOptional()
  displayBranchId: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  placeOfBirth: string;

  @IsNotEmpty()
  @IsString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  emailAddress: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  identityType: string;

  @IsNotEmpty()
  @IsString()
  identityNumber: string;

  @IsNotEmpty()
  @IsString()
  identityAddress: string;

  @IsNotEmpty()
  @IsString()
  identityCity: string;

  @IsNotEmpty()
  @IsString()
  identityZipCode: string;

  @IsOptional()
  jobTitlePersonal: string;

  @IsOptional()
  companyName: string;

  @IsOptional()
  companyPhoneNumber: string;

  @IsOptional()
  companyAddress: string;

  @IsOptional()
  companyAddressCity: string;

  @IsOptional()
  companyAddressZipCode: string;

  @IsNotEmpty()
  @IsString()
  billingSalutation: string;

  @IsNotEmpty()
  @IsString()
  billingName: string;

  @IsNotEmpty()
  @IsString()
  billingEmail: string;

  @IsOptional()
  billingJobTitle: string;

  @IsNotEmpty()
  @IsString()
  technicalSalutation: string;

  @IsNotEmpty()
  @IsString()
  technicalName: string;

  @IsNotEmpty()
  @IsString()
  technicalEmail: string;

  @IsOptional()
  technicalJobTitle: string;

  @IsNotEmpty()
  @IsString()
  billingPhone: string;

  @IsNotEmpty()
  @IsString()
  technicalPhone: string;

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
  packageCode: string;

  @IsNotEmpty()
  @IsString()
  packageName: string;

  @IsNotEmpty()
  @IsString()
  packagePrice: string;

  @IsNotEmpty()
  @IsString()
  packageTop: string;

  @IsOptional()
  promoId: string;

  @IsNotEmpty()
  @IsString()
  ppn: string;

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

  @IsOptional()
  @IsString()
  npwpNumber: string;

  @IsNotEmpty()
  @IsBoolean()
  taxType: boolean;

  @IsNotEmpty()
  @IsBoolean()
  cetakDuluan: boolean;
}
