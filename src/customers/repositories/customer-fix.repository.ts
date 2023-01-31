import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CustomerFix } from '../entities/customer-fix.entity';
import { hashPasswordMd5 } from 'src/utils/md5-hashing.util';
import { NewCustomerInitValue } from '../interfaces/new-customer.interface';
import { addressSplitter } from 'src/utils/address-splitter.util';
import {
  CUSTOMER_BILLING_ADD,
  CUSTOMER_DEFAULT_BUSINESS_TYPE_ID,
  CUSTOMER_DEFAULT_STATUS,
} from './customer.repository';

@Injectable()
export class CustomerFixRepository extends Repository<CustomerFix> {
  constructor(private dataSource: DataSource) {
    super(CustomerFix, dataSource.createEntityManager());
  }

  assignCustomerFixValue(newCustomerValue: NewCustomerInitValue): CustomerFix {
    const CustFix = new CustomerFix();
    CustFix.CustId = newCustomerValue.custId;
    CustFix.CustPass = hashPasswordMd5();
    CustFix.BranchId = newCustomerValue.displayBranchId
      ? newCustomerValue.displayBranchId
      : newCustomerValue.branchId;
    CustFix.FormId = newCustomerValue.formId;
    CustFix.CustName = newCustomerValue.fullName.toUpperCase();
    CustFix.CustGender = newCustomerValue.gender;
    CustFix.custPOB = newCustomerValue.placeOfBirth.toUpperCase();
    CustFix.custDOB = newCustomerValue.dateOfBirth;
    CustFix.CustIdType = newCustomerValue.identityType;
    CustFix.CustIdNumber = newCustomerValue.identityNumber;
    CustFix.CustJobTitle = newCustomerValue.jobTitlePersonal.toUpperCase();
    CustFix.CustResAdd1 = addressSplitter(
      newCustomerValue.identityAddress,
    )[0].toUpperCase();
    CustFix.CustResAdd2 = addressSplitter(
      newCustomerValue.identityAddress,
    )[1].toUpperCase();
    CustFix.CustResCity = newCustomerValue.identityCity.toUpperCase();
    CustFix.CustResZC = newCustomerValue.identityZipCode;
    CustFix.CustCompany =
      newCustomerValue.companyName != null
        ? newCustomerValue.companyName.toUpperCase()
        : newCustomerValue.fullName.toUpperCase();
    CustFix.CustBusName =
      newCustomerValue.companyName != null
        ? newCustomerValue.companyName.toUpperCase()
        : newCustomerValue.fullName.toUpperCase();
    CustFix.BusId = CUSTOMER_DEFAULT_BUSINESS_TYPE_ID; // BusId adalah Bussiness Id Type di IS dan defaultnya adalah others
    CustFix.CustOfficeAdd1 =
      newCustomerValue.companyAddress != null
        ? addressSplitter(newCustomerValue.companyAddress)[0].toUpperCase()
        : addressSplitter(
            newCustomerValue.installationAddress,
          )[0].toUpperCase();
    CustFix.CustOfficeAdd2 =
      newCustomerValue.companyAddress != null
        ? addressSplitter(newCustomerValue.companyAddress)[1].toUpperCase()
        : addressSplitter(
            newCustomerValue.installationAddress,
          )[1].toUpperCase();
    CustFix.CustOfficeCity =
      newCustomerValue.companyAddressCity != null
        ? newCustomerValue.companyAddressCity.toUpperCase()
        : newCustomerValue.installationAddressCity.toUpperCase();
    CustFix.CustOfficeZC =
      newCustomerValue.companyAddressZipCode != null
        ? newCustomerValue.companyAddressZipCode
        : newCustomerValue.installationAddressZipCode;
    CustFix.CustBillingAdd = CUSTOMER_BILLING_ADD;
    CustFix.CustTechCP = newCustomerValue.technicalName.toUpperCase();
    CustFix.CustTechCPPosition =
      newCustomerValue.technicalJobTitle.toUpperCase();
    CustFix.CustBillCP = newCustomerValue.billingName.toUpperCase();
    CustFix.CustBillCPPosition = newCustomerValue.billingJobTitle.toUpperCase();
    CustFix.CustBillCPEmail = newCustomerValue.billingEmail;
    CustFix.CustRegDate = new Date();
    CustFix.CustNotes = newCustomerValue.extendNote.toUpperCase();
    CustFix.InsertEmpId = newCustomerValue.approvalEmpId;
    CustFix.EmpApproval = newCustomerValue.approvalEmpId;
    CustFix.CustStatus = CUSTOMER_DEFAULT_STATUS;
    CustFix.SalesId = newCustomerValue.salesId;
    CustFix.InsertDateTime = new Date();
    CustFix.UpdateDateTime = new Date();
    CustFix.TaxType = newCustomerValue.taxType;
    return CustFix;
  }
}
