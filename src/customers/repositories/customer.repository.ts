import { Repository, DataSource } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { Subscription } from '../entities/subscriber.entity';
import { CustomerServiceTechnicalCustom } from '../entities/customer-service-technical-custom.entity';
import { NOCFiber } from '../entities/noc-fiber.entity';
import { CreateNewServiceCustomersDto } from '../dtos/create-service-customer.dto';
import { Injectable } from '@nestjs/common';
import { CustomerTemp } from '../entities/customer-temp.entity';
import { hashPasswordMd5 } from '../../utils/md5-hashing.util';
import { NewCustomerInitValue } from '../interfaces/new-customer.interface';
import { addressSplitter } from '../../utils/address-splitter.util';

@Injectable()
export class CustomerRepository extends Repository<Customer> {
  constructor(private dataSource: DataSource) {
    super(Customer, dataSource.createEntityManager());
  }

  async getCustomerRepository(cid): Promise<any> {
    let resultObject = {};

    // Step 1 : Ambil Data Customer
    try {
      const queryBuilderOne = this.createQueryBuilder('c')
        .select([
          "c.BranchId AS 'branch_id'",
          "c.DisplayBranchId AS 'display_branch_id'",
          "c.CustName AS 'full_name'",
          "c.CustGender AS 'gender'",
          "c.CustPOB AS 'place_of_birth'",
          "c.CustDOB AS 'date_of_birth'",
          "c.CustBillCPEmail AS 'email_address'",
          "c.CustHP AS 'phone_number'",
          "CONCAT_WS(', ', c.CustResAdd1, c.CustResAdd2, c.CustResCity) AS 'address'",
          "c.CustIdType AS 'identity_type'",
          "c.CustIdNumber AS 'identity_number'",
          "c.CustCompany AS 'company_name'",
          "CONCAT_WS(', ', c.CustOfficeAdd1, c.CustOfficeAdd2, c.CustOfficeCity) AS 'company_address'",
          "c.CustOfficePhone AS 'company_phone_number'",
          "c.CustBillCP AS 'billing_name'",
          "c.CustBillCPEmail AS 'billing_email'",
          "c.CustTechCP AS 'technical_name'",
          "c.CustTechCPEmail AS 'technical_email'",
          "c.SalesId AS 'sales_id'",
          "c.ManagerSalesId AS 'manager_sales_id'",
        ])
        .where('c.CustId = :id', { id: cid });
      const getDataCustomerByID = await queryBuilderOne.getRawMany();
      resultObject = getDataCustomerByID[0];
    } catch (error) {
      resultObject = null;
    }

    if (resultObject != null) {
      // Step 2 : Ambil Data CustomerService dan InvoiceTypeMonth
      resultObject['list_of_services'] = null;
      try {
        const queryBuilderTwo = await this.dataSource.query(`
          SELECT 
          cs.ServiceId 'package_code',
          cs.Subscription 'package_price',
          itm.Month 'package_top'
          FROM CustomerServices cs
          LEFT JOIN InvoiceTypeMonth itm ON itm.InvoiceType = cs.InvoiceType 
          WHERE cs.CustId = '${cid}'
        `);
        resultObject['list_of_services'] = queryBuilderTwo;
      } catch (error) {
        resultObject['list_of_services'] = null;
      }

      // Step 3 : Ambil SMS Phonebook
      resultObject['billing_phone'] = null;
      resultObject['technical_phone'] = null;
      try {
        const queryBuilderThree = await this.dataSource.query(
          `SELECT sp.phone FROM sms_phonebook sp WHERE sp.custId = '${cid}' AND sp.name LIKE '%${resultObject['billing_name']}%'`,
        );
        const queryBuilderFour = await this.dataSource.query(
          `SELECT sp.phone FROM sms_phonebook sp WHERE sp.custId = '${cid}' AND sp.name LIKE '%${resultObject['technical_name']}%'`,
        );
        resultObject['billing_phone'] =
          queryBuilderThree[0]?.phone !== undefined
            ? queryBuilderThree[0].phone
            : '';
        resultObject['technical_phone'] =
          queryBuilderFour[0]?.phone !== undefined
            ? queryBuilderFour[0].phone
            : '';
      } catch (error) {
        resultObject['billing_phone'] = null;
        resultObject['technical_phone'] = null;
      }

      // Step 4 : Ambil NPWP Number
      resultObject['npwp_number'] = null;
      try {
        const queryBuilderFive = await this.dataSource.query(`
          SELECT nc.NPWP FROM NPWP_Customer nc
          WHERE nc.CustId = '${cid}' AND nc.Selected = 1
        `);
        resultObject['npwp_number'] = queryBuilderFive[0].NPWP;
      } catch (error) {
        resultObject['npwp_number'] = null;
      }
    } else {
      resultObject = {};
    }

    return resultObject;
  }

  async searchCustomerByIdentityNum(identityNumber: string): Promise<any> {
    let resultSearchCustomerByIdentityNum = null;

    // Step 1 : Check Customer Service Active with Identity Number
    const findCustomerByIdentityNumber = await this.createQueryBuilder('c')
      .innerJoin('CustomerServices', 'cs', 'c.CustId = cs.CustId')
      .where(`c.CustIdNumber = ${identityNumber} AND cs.CustStatus = 'AC'`)
      .getRawOne();

    if (typeof findCustomerByIdentityNumber != 'undefined') {
      resultSearchCustomerByIdentityNum = findCustomerByIdentityNumber.c_CustId;
    }

    return resultSearchCustomerByIdentityNum;
  }

  async generateCustomerId() {
    let custIdResult = null;

    // Step 1 : Ambil Data dari CustomerTemp
    const fetchCustomerTemp = await CustomerTemp.find({
      where: {
        Taken: 0,
      },
    });

    for (let idx = 0; idx < fetchCustomerTemp.length; idx++) {
      const isCustomerExist = (await this.findOne({
        where: {
          CustId: fetchCustomerTemp[idx].CustId,
        },
      }))
        ? true
        : false;

      if (!isCustomerExist) {
        custIdResult = fetchCustomerTemp[idx].CustId;
        break;
      } else {
        continue;
      }
    }

    return custIdResult;
  }

  async checkFormID(branchId) {
    let formIdResult = null;

    // Step 1 : Ambil Data dari CustomerTemp
    const fetchDataCustomerLast = await Subscription.createQueryBuilder('cs')
      .select('c.FormId FormId')
      .innerJoin('Customer', 'c', 'cs.CustId = c.CustId')
      .where('IFNULL(c.DisplayBranchId, c.BranchId) = :branchId', {
        branchId: branchId,
      })
      .orderBy('cs.CustServId', 'DESC')
      .limit(1)
      .getRawMany();

    const formIdIdentifier = [];
    const resultLastFormId = fetchDataCustomerLast[0].FormId;
    if (/[a-zA-Z]+/g.test(resultLastFormId)) {
      formIdIdentifier['num'] = parseInt(resultLastFormId.match(/\d+/g)) + 1;
      formIdIdentifier['char'] = String(resultLastFormId.match(/[a-zA-Z]+/g));
      formIdResult = formIdIdentifier['char'].concat(formIdIdentifier['num']);
    } else {
      const number = resultLastFormId;
      if (number.length != parseInt(number).toString().length) {
        formIdResult = '0' + (parseInt(number) + 1).toString();
      } else {
        formIdResult = `${parseInt(resultLastFormId.match(/\d+/g)) + 1}`;
      }
    }

    return formIdResult;
  }

  async checkAccountName(fullName: string, address: string) {
    let resultAccName = null;
    const fullNameStr = fullName.toLowerCase().split(' ')[0];
    const randNumber = Math.floor(1000 + Math.random() * 9000);
    resultAccName = fullNameStr + randNumber;
    const searchByAccName = await Subscription.find({
      where: {
        CustAccName: resultAccName,
      },
    });

    if (searchByAccName.length > 0) {
      await this.checkAccountName(fullName, address);
    }

    return resultAccName;
  }

  async assignCustomerData(
    newCustomerValue: NewCustomerInitValue,
  ): Promise<Customer> {
    const pelanggan = new Customer();
    pelanggan.CustId = newCustomerValue.custId;
    pelanggan.CustPass = hashPasswordMd5();
    pelanggan.BranchId = newCustomerValue.displayBranchId
      ? newCustomerValue.displayBranchId
      : newCustomerValue.branchId;
    pelanggan.DisplayBranchId = newCustomerValue.displayBranchId;
    pelanggan.FormId = newCustomerValue.formId;
    pelanggan.CustName = newCustomerValue.fullName;
    pelanggan.CustGender = newCustomerValue.gender;
    pelanggan.custPOB = newCustomerValue.placeOfBirth;
    pelanggan.custDOB = newCustomerValue.dateOfBirth;
    pelanggan.CustIdType = newCustomerValue.identityType;
    pelanggan.CustIdNumber = newCustomerValue.identityNumber;
    pelanggan.CustJobTitle = newCustomerValue.jobTitlePersonal;
    pelanggan.CustResAdd1 = addressSplitter(
      newCustomerValue.identityAddress,
    )[0];
    pelanggan.CustResAdd2 = addressSplitter(
      newCustomerValue.identityAddress,
    )[1];
    pelanggan.CustResCity = newCustomerValue.identityCity;
    pelanggan.CustResZC = newCustomerValue.identityZipCode;
    pelanggan.CustCompany =
      newCustomerValue.companyName != null
        ? newCustomerValue.companyName
        : newCustomerValue.fullName;
    pelanggan.CustBusName =
      newCustomerValue.companyName != null
        ? newCustomerValue.companyName
        : newCustomerValue.fullName;
    pelanggan.BusId = CUSTOMER_DEFAULT_BUSINESS_TYPE_ID; // BusId adalah Bussiness Id Type di IS dan defaultnya adalah others
    pelanggan.CustOfficeAdd1 =
      newCustomerValue.companyAddress != null
        ? addressSplitter(newCustomerValue.companyAddress)[0]
        : addressSplitter(newCustomerValue.installationAddress)[0];
    pelanggan.CustOfficeAdd2 =
      newCustomerValue.companyAddress != null
        ? addressSplitter(newCustomerValue.companyAddress)[1]
        : addressSplitter(newCustomerValue.installationAddress)[1];
    pelanggan.CustOfficeCity =
      newCustomerValue.companyAddressCity != null
        ? newCustomerValue.companyAddressCity
        : newCustomerValue.installationAddressCity;
    pelanggan.CustOfficeZC =
      newCustomerValue.companyAddressZipCode != null
        ? newCustomerValue.companyAddressZipCode
        : newCustomerValue.installationAddressZipCode;
    pelanggan.CustBillingAdd = CUSTOMER_BILLING_ADD;
    pelanggan.CustTechCP = newCustomerValue.technicalName;
    pelanggan.CustTechCPPosition = newCustomerValue.technicalJobTitle;
    pelanggan.CustBillCP = newCustomerValue.billingName;
    pelanggan.CustBillCPPosition = newCustomerValue.billingJobTitle;
    pelanggan.CustBillMethodLetter = CUSTOMER_BILLING_METHOD.letter;
    pelanggan.CustBillMethodEmail = CUSTOMER_BILLING_METHOD.email;
    pelanggan.CustBillCPEmail = newCustomerValue.billingEmail;
    pelanggan.CustRegDate = new Date();
    pelanggan.CustNotes = newCustomerValue.extendNote;
    pelanggan.InsertEmpId = newCustomerValue.approvalEmpId;
    pelanggan.EmpApproval = newCustomerValue.approvalEmpId;
    pelanggan.CustStatus = CUSTOMER_DEFAULT_STATUS;
    pelanggan.SalesId = newCustomerValue.salesId;
    pelanggan.InsertDateTime = new Date();
    pelanggan.UpdateDateTime = new Date();
    pelanggan.TaxType = newCustomerValue.taxType;
    pelanggan.CetakDuluan = newCustomerValue.cetakDuluan;
    pelanggan.ManagerSalesId = newCustomerValue.managerSalesId;

    return pelanggan;
  }

  getNocFiberId(branchIds: string[], vendorIds: number[]) {
    return NOCFiber.createQueryBuilder('f')
      .select(['f.id'])
      .where('f.branchId IN (:...branchIds)', { branchIds: branchIds })
      .andWhere('f.vendorId IN (:...vendorIds)', { vendorIds: vendorIds })
      .getMany();
  }

  getOperatorSubscriptions(NocFiberId: number[], status: string[]) {
    return CustomerServiceTechnicalCustom.createQueryBuilder('a')
      .select([
        'c.custServId id',
        'c.CustAccName acc',
        'a.value CID',
        'c.CustStatus status',
        'd.Month periode',
        'c.Subscription charge',
        'c.Discount discount',
        'c.CustActivationDate activationDate',
        'c.CustUnregDate unregDate',
        'c.CustBlockDate blockDate',
      ])
      .leftJoin('CustomerServiceTechnicalLink', 'b', 'b.id = a.technicalTypeId')
      .leftJoin('CustomerServices', 'c', 'c.custServId = b.custServId')
      .leftJoin('InvoiceTypeMonth', 'd', 'c.InvoiceType = d.InvoiceType')
      .where('a.attribute = :attribute', { attribute: 'Vendor CID' })
      .andWhere('c.CustStatus IN (:...custStatus)', { custStatus: status })
      .andWhere('b.foVendorId IN (:...foVendorId)', { foVendorId: NocFiberId })
      .getRawMany();
  }
}

export const CUSTOMER_DEFAULT_BUSINESS_TYPE_ID = '090';
export const CUSTOMER_BILLING_ADD = true;
export const CUSTOMER_BILLING_METHOD = {
  letter: false,
  email: true,
};
export const CUSTOMER_DEFAULT_STATUS = 'AC';
