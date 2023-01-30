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
    CustFix.CustName = newCustomerValue.fullName;
    CustFix.CustGender = newCustomerValue.gender;
    CustFix.custPOB = newCustomerValue.placeOfBirth;
    CustFix.custDOB = newCustomerValue.dateOfBirth;
    CustFix.CustIdType = newCustomerValue.identityType;
    CustFix.CustIdNumber = newCustomerValue.identityNumber;
    CustFix.CustJobTitle = newCustomerValue.jobTitlePersonal;
    CustFix.CustResAdd1 = addressSplitter(newCustomerValue.identityAddress)[0];
    CustFix.CustResAdd2 = addressSplitter(newCustomerValue.identityAddress)[1];
    CustFix.CustResCity = newCustomerValue.identityCity;
    CustFix.CustResZC = newCustomerValue.identityZipCode;
    CustFix.CustCompany =
      newCustomerValue.companyName != null
        ? newCustomerValue.companyName
        : newCustomerValue.fullName;
    CustFix.CustBusName =
      newCustomerValue.companyName != null
        ? newCustomerValue.companyName
        : newCustomerValue.fullName;
    CustFix.BusId = CUSTOMER_DEFAULT_BUSINESS_TYPE_ID; // BusId adalah Bussiness Id Type di IS dan defaultnya adalah others
    CustFix.CustOfficeAdd1 =
      newCustomerValue.companyAddress != null
        ? addressSplitter(newCustomerValue.companyAddress)[0]
        : addressSplitter(newCustomerValue.installationAddress)[0];
    CustFix.CustOfficeAdd2 =
      newCustomerValue.companyAddress != null
        ? addressSplitter(newCustomerValue.companyAddress)[1]
        : addressSplitter(newCustomerValue.installationAddress)[1];
    CustFix.CustOfficeCity =
      newCustomerValue.companyAddressCity != null
        ? newCustomerValue.companyAddressCity
        : newCustomerValue.installationAddressCity;
    CustFix.CustOfficeZC =
      newCustomerValue.companyAddressZipCode != null
        ? newCustomerValue.companyAddressZipCode
        : newCustomerValue.installationAddressZipCode;
    CustFix.CustBillingAdd = CUSTOMER_BILLING_ADD;
    CustFix.CustTechCP = newCustomerValue.technicalName;
    CustFix.CustTechCPPosition = newCustomerValue.technicalJobTitle;
    CustFix.CustBillCP = newCustomerValue.billingName;
    CustFix.CustBillCPPosition = newCustomerValue.billingJobTitle;
    CustFix.CustBillCPEmail = newCustomerValue.billingEmail;
    CustFix.CustRegDate = new Date();
    CustFix.CustNotes = newCustomerValue.extendNote;
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
