import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CustomerProfileHistory } from '../entities/customer-profile-history.entity';
import { NewCustomerInitValue } from '../interfaces/new-customer.interface';
import { hashPasswordMd5 } from '../../utils/md5-hashing.util';
import { addressSplitter } from 'src/utils/address-splitter.util';
import {
  CUSTOMER_BILLING_ADD,
  CUSTOMER_BILLING_METHOD,
  CUSTOMER_DEFAULT_BUSINESS_TYPE_ID,
  CUSTOMER_DEFAULT_STATUS,
} from './customer.repository';

@Injectable()
export class CustomerProfileHistoryRepository extends Repository<CustomerProfileHistory> {
  constructor(private dataSource: DataSource) {
    super(CustomerProfileHistory, dataSource.createEntityManager());
  }

  assignCustomerProfileHistory(
    newCustomerValue: NewCustomerInitValue,
  ): CustomerProfileHistory {
    const CustProfileHistory = new CustomerProfileHistory();
    CustProfileHistory.CustId = newCustomerValue.custId;
    CustProfileHistory.CustPass = hashPasswordMd5();
    CustProfileHistory.BranchId = newCustomerValue.displayBranchId
      ? newCustomerValue.displayBranchId
      : newCustomerValue.branchId;
    CustProfileHistory.DisplayBranchId = newCustomerValue.displayBranchId;
    CustProfileHistory.FormId = newCustomerValue.formId;
    CustProfileHistory.CustName = newCustomerValue.fullName;
    CustProfileHistory.CustGender = newCustomerValue.gender;
    CustProfileHistory.custPOB = newCustomerValue.placeOfBirth;
    CustProfileHistory.custDOB = newCustomerValue.dateOfBirth;
    CustProfileHistory.CustIdType = newCustomerValue.identityType;
    CustProfileHistory.CustIdNumber = newCustomerValue.identityNumber;
    CustProfileHistory.CustJobTitle = newCustomerValue.jobTitlePersonal;
    CustProfileHistory.CustResAdd1 = addressSplitter(
      newCustomerValue.identityAddress,
    )[0];
    CustProfileHistory.CustResAdd2 = addressSplitter(
      newCustomerValue.identityAddress,
    )[1];
    CustProfileHistory.CustResCity = newCustomerValue.identityCity;
    CustProfileHistory.CustResZC = newCustomerValue.identityZipCode;
    CustProfileHistory.CustCompany =
      newCustomerValue.companyName != null
        ? newCustomerValue.companyName
        : newCustomerValue.fullName;
    CustProfileHistory.CustBusName =
      newCustomerValue.companyName != null
        ? newCustomerValue.companyName
        : newCustomerValue.fullName;
    CustProfileHistory.BusId = CUSTOMER_DEFAULT_BUSINESS_TYPE_ID; // BusId adalah Bussiness Id Type di IS dan defaultnya adalah others
    CustProfileHistory.CustOfficeAdd1 =
      newCustomerValue.companyAddress != null
        ? addressSplitter(newCustomerValue.companyAddress)[0]
        : addressSplitter(newCustomerValue.installationAddress)[0];
    CustProfileHistory.CustOfficeAdd2 =
      newCustomerValue.companyAddress != null
        ? addressSplitter(newCustomerValue.companyAddress)[1]
        : addressSplitter(newCustomerValue.installationAddress)[1];
    CustProfileHistory.CustOfficeCity =
      newCustomerValue.companyAddressCity != null
        ? newCustomerValue.companyAddressCity
        : newCustomerValue.installationAddressCity;
    CustProfileHistory.CustOfficeZC =
      newCustomerValue.companyAddressZipCode != null
        ? newCustomerValue.companyAddressZipCode
        : newCustomerValue.installationAddressZipCode;
    CustProfileHistory.CustBillingAdd = CUSTOMER_BILLING_ADD;
    CustProfileHistory.CustTechCP = newCustomerValue.technicalName;
    CustProfileHistory.CustTechCPPosition = newCustomerValue.technicalJobTitle;
    CustProfileHistory.CustBillCP = newCustomerValue.billingName;
    CustProfileHistory.CustBillCPPosition = newCustomerValue.billingJobTitle;
    CustProfileHistory.CustBillMethodLetter = CUSTOMER_BILLING_METHOD.letter;
    CustProfileHistory.CustBillMethodEmail = CUSTOMER_BILLING_METHOD.email;
    CustProfileHistory.CustBillCPEmail = newCustomerValue.billingEmail;
    CustProfileHistory.CustRegDate = new Date();
    CustProfileHistory.CustNotes = newCustomerValue.extendNote;
    CustProfileHistory.InsertEmpId = newCustomerValue.approvalEmpId;
    CustProfileHistory.EmpApproval = newCustomerValue.approvalEmpId;
    CustProfileHistory.CustStatus = CUSTOMER_DEFAULT_STATUS;
    CustProfileHistory.SalesId = newCustomerValue.salesId;
    CustProfileHistory.InsertDateTime = new Date();
    CustProfileHistory.UpdateDateTime = new Date();
    CustProfileHistory.TaxType = newCustomerValue.taxType;
    CustProfileHistory.CetakDuluan = newCustomerValue.cetakDuluan;
    CustProfileHistory.ManagerSalesId = newCustomerValue.managerSalesId;

    return CustProfileHistory;
  }
}
