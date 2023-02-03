import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNewCustomerDto {
  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'branch_id' })
  branchId: string;

  @IsOptional()
  @Expose({ name: 'display_branch_id' })
  displayBranchId: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'full_name' })
  fullName: string;

  @IsNotEmpty()
  @IsString()
  gender: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'place_of_birth' })
  placeOfBirth: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'date_of_birth' })
  dateOfBirth: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'email_address' })
  emailAddress: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'phone_number' })
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'identity_type' })
  identityType: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'identity_number' })
  identityNumber: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'identity_address' })
  identityAddress: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'identity_city' })
  identityCity: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'identity_zip_code' })
  identityZipCode: string;

  @IsOptional()
  @Expose({ name: 'job_title_personal' })
  jobTitlePersonal: string;

  @IsOptional()
  @Expose({ name: 'company_name' })
  companyName: string;

  @IsOptional()
  @Expose({ name: 'company_phone_number' })
  companyPhoneNumber: string;

  @IsOptional()
  @Expose({ name: 'company_address' })
  companyAddress: string;

  @IsOptional()
  @Expose({ name: 'company_address_city' })
  companyAddressCity: string;

  @IsOptional()
  @Expose({ name: 'company_address_zip_code' })
  companyAddressZipCode: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'billing_salutation' })
  billingSalutation: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'billing_name' })
  billingName: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'billing_email' })
  billingEmail: string;

  @IsOptional()
  @Expose({ name: 'billing_job_title' })
  billingJobTitle: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'technical_salutation' })
  technicalSalutation: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'technical_name' })
  technicalName: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'technical_email' })
  technicalEmail: string;

  @IsOptional()
  @Expose({ name: 'technical_job_title' })
  technicalJobTitle: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'billing_phone' })
  billingPhone: string;

  @IsNotEmpty()
  @IsString()
  @Expose({ name: 'technical_phone' })
  technicalPhone: string;

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

  @IsOptional()
  @Expose({ name: 'promo_id' })
  promoId: string;

  @IsNotEmpty()
  @IsString()
  ppn: string;

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

  @IsOptional()
  @IsString()
  @Expose({ name: 'npwp_number' })
  npwpNumber: string;

  @IsNotEmpty()
  @IsBoolean()
  @Expose({ name: 'tax_type' })
  taxType: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Expose({ name: 'cetak_duluan' })
  cetakDuluan: boolean;
}
