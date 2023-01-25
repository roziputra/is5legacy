import { Repository, DataSource } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { Subscription } from '../entities/subscriber.entity';
import { NPWPCustomer } from '../entities/customer-npwp.entity';
import { SMSPhonebook } from '../entities/sms-phonebook.entity';
import { CustomerServiceTechnicalCustom } from '../entities/customer-service-technical-custom.entity';
import { NOCFiber } from '../entities/noc-fiber.entity';
import { CreateNewCustomerDto } from '../dto/create-customer.dto';
import { CreateNewServiceCustomersDto } from '../dto/create-service-customer.dto';
import { Injectable } from '@nestjs/common';
import * as md5 from 'md5';
import { CustomerInvoiceSignature } from '../entities/customer-invoice-signature.entity';
import { CustomerFix } from '../entities/customer-fix.entity';
import { CustomerProfileHistory } from '../entities/customer-profile-history.entity';
import { CustomerVerifiedEmail } from '../entities/customer-verified-email.entity';
import { CustomerTemp } from '../entities/customer-temp.entity';
import { CustomerGlobalSearch } from '../entities/customer-global-search.entity';
import { CustomerServicesHistoryNew } from '../entities/customer-service-history-new.entity';
import { InvoiceTypeMonth } from '../entities/invoice-type-month.entity';

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

  async saveNewCustomerRepositories(
    createCustomerDto: CreateNewCustomerDto,
  ): Promise<any> {
    let resultSaveDataCustomer = null;

    // Step 1 : Check Customer with same identity
    let searchCustomerExist = null;
    searchCustomerExist = await this.searchCustomerByIdentityNum(
      createCustomerDto.identity_number,
    );
    if (searchCustomerExist) {
      resultSaveDataCustomer = searchCustomerExist;
    }

    // Step 2 : Init CustID
    let custId = null;
    custId = await this.generateCustomerId();

    // Step 3 : Init FormID
    let formId = null;
    if (createCustomerDto.display_branch_id) {
      formId = await this.checkFormID(createCustomerDto.display_branch_id);
    } else {
      formId = await this.checkFormID(createCustomerDto.branch_id);
    }

    // Step 4 : Check Account ID
    let accName = null;
    accName = await this.checkAccountName(
      createCustomerDto.full_name,
      createCustomerDto.installation_address,
    );

    // Step 5 : Assign Data Pelanggan ke Tabel Customer
    let customerData = null;
    customerData = await this.assignCustomerData(
      createCustomerDto,
      custId,
      formId,
    );

    // Step 6 : Update Customer Temp To Taken = 1
    let customerTakenCustID = null;
    customerTakenCustID = await this.assignCustomerTemp(custId);

    // Step 7 : Assign Data Pelanggan ke Tabel CustomerInvoiceSignature
    let customerInvoiceSign = null;
    customerInvoiceSign = await this.assignCustomerInvoiceSignature(
      createCustomerDto,
      custId,
    );

    // Step 8 : Assign Data Pelanggan ke Tabel CustomerFix
    let customerFix = null;
    customerFix = await this.assignCustomerFix(
      createCustomerDto,
      custId,
      formId,
    );

    // Step 9 : Assign Data NPWP ke Tabel NPWP
    let npwpCustomer = null;
    npwpCustomer = await this.assignNpwpCust(createCustomerDto, custId);

    // Step 10 : Assign Data SMS Phonebook ke SMS Phonebook
    let smsPhonebook = null;
    smsPhonebook = await this.assignSmsPhonebook(createCustomerDto, custId);

    // Step 11 : Assign Data Pelanggan ke Tabel CustomerProfileHistory
    let customerProfileHistory = null;
    customerProfileHistory = await this.assignCustomerProfileHistory(
      createCustomerDto,
      custId,
      formId,
    );

    // Step 12 : Assign Data Pelanggan ke Tabel CustomerVerifiedEmail
    let customerVerifiedEmail = null;
    customerVerifiedEmail = await this.assignCustomerVerifiedEmail(
      createCustomerDto,
      custId,
    );

    // Step 13 : Assign Data Pelanggan ke Tabel CustomerGlobalSearch
    let customerGlobalSearch = null;
    customerGlobalSearch = await this.assignCustomerGlobalSearch(customerData);

    // Step 14 : Assign Data Layanan ke Tabel CustomerService
    let customerService = null;
    customerService = await this.assignSubscription(
      createCustomerDto,
      custId,
      accName,
    );

    // Step 15 : Assign Data Pelanggan ke Tabel CustomerServiceHistoryNew
    let customerServiceHistoryNew = null;
    customerServiceHistoryNew = await this.assignCustomerServiceHistoryNew(
      createCustomerDto,
      customerService,
    );

    // Step 16 : Eksekusi Logic Simpan Pelanggan Baru
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(customerData);
      await queryRunner.manager.save(customerTakenCustID);
      await queryRunner.manager.save(customerInvoiceSign);
      await queryRunner.manager.save(customerFix);
      await queryRunner.manager.save(npwpCustomer);
      await queryRunner.manager.save(smsPhonebook['smsPhoneBook1']);
      if (
        smsPhonebook['smsPhoneBook1'].phone !=
        smsPhonebook['smsPhoneBook2'].phone
      ) {
        await queryRunner.manager.save(smsPhonebook['smsPhoneBook2']);
      }
      await queryRunner.manager.save(customerProfileHistory);
      await queryRunner.manager.save(
        customerVerifiedEmail['CustVerifiedEmail1'],
      );
      if (
        customerVerifiedEmail['CustVerifiedEmail1'].cust_email !=
        customerVerifiedEmail['CustVerifiedEmail2'].cust_email
      ) {
        await queryRunner.manager.save(
          customerVerifiedEmail['CustVerifiedEmail2'],
        );
      }
      await queryRunner.manager.save(customerGlobalSearch);
      await queryRunner.manager.save(customerService);
      await queryRunner.manager.save(customerServiceHistoryNew);
      await queryRunner.commitTransaction();
      resultSaveDataCustomer = custId;
    } catch (error) {
      resultSaveDataCustomer = null;
      await queryRunner.rollbackTransaction();
    }
    return resultSaveDataCustomer;
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
    const fetchCustomerTemp = await CustomerTemp.findOne({
      where: {
        Taken: 0,
      },
    });

    // Step 2 : Cek Data Customer
    const fetchCustomerByCustId = await this.findOne({
      where: {
        CustId: fetchCustomerTemp.CustId,
      },
    });

    if (fetchCustomerByCustId) {
      await this.generateCustomerId();
    } else {
      custIdResult = fetchCustomerTemp.CustId;
    }

    return custIdResult;
  }

  async checkFormID(branch_id) {
    let formIdResult = null;

    // Step 1 : Ambil Data dari CustomerTemp
    const fetchDataCustomerLast = await this.createQueryBuilder()
      .select('FormId')
      .where('IFNULL(DisplayBranchId, BranchId) = :branch_id', {
        branch_id: branch_id,
      })
      .orderBy('CustId', 'DESC')
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
    createCustomerDto: CreateNewCustomerDto,
    CustID,
    FormID,
  ): Promise<Customer> {
    const pelanggan = new Customer();

    pelanggan.CustId = CustID;
    pelanggan.CustPass = this.hashPasswordMd5();
    pelanggan.BranchId = createCustomerDto.display_branch_id
      ? createCustomerDto.display_branch_id
      : createCustomerDto.branch_id;
    pelanggan.DisplayBranchId = createCustomerDto.display_branch_id;
    pelanggan.FormId = FormID;
    pelanggan.CustName = createCustomerDto.full_name;
    pelanggan.CustGender = createCustomerDto.gender;
    pelanggan.custPOB = createCustomerDto.place_of_birth;
    pelanggan.custDOB = createCustomerDto.date_of_birth;
    pelanggan.CustIdType = createCustomerDto.identity_type;
    pelanggan.CustIdNumber = createCustomerDto.identity_number;
    pelanggan.CustJobTitle = createCustomerDto.job_title_personal;
    pelanggan.CustResAdd1 = this.addressSplitter(
      createCustomerDto.identity_address,
    )[0];
    pelanggan.CustResAdd2 = this.addressSplitter(
      createCustomerDto.identity_address,
    )[1];
    pelanggan.CustResCity = createCustomerDto.identity_city;
    pelanggan.CustResZC = createCustomerDto.identity_zip_code;
    pelanggan.CustCompany =
      createCustomerDto.company_name != null
        ? createCustomerDto.company_name
        : createCustomerDto.full_name;
    pelanggan.CustBusName =
      createCustomerDto.company_name != null
        ? createCustomerDto.company_name
        : createCustomerDto.full_name;
    pelanggan.BusId = CUSTOMER_DEFAULT_BUSINESS_TYPE_ID; // BusId adalah Bussiness Id Type di IS dan defaultnya adalah others
    pelanggan.CustOfficeAdd1 =
      createCustomerDto.company_address != null
        ? this.addressSplitter(createCustomerDto.company_address)[0]
        : this.addressSplitter(createCustomerDto.installation_address)[0];
    pelanggan.CustOfficeAdd2 =
      createCustomerDto.company_address != null
        ? this.addressSplitter(createCustomerDto.company_address)[1]
        : this.addressSplitter(createCustomerDto.installation_address)[1];
    pelanggan.CustOfficeCity =
      createCustomerDto.company_address_city != null
        ? createCustomerDto.company_address_city
        : createCustomerDto.installation_address_city;
    pelanggan.CustOfficeZC =
      createCustomerDto.company_address_city != null
        ? createCustomerDto.company_address_zip_code
        : createCustomerDto.installation_address_zip_code;
    pelanggan.CustBillingAdd = CUSTOMER_BILLING_ADD;
    pelanggan.CustTechCP = createCustomerDto.technical_name;
    pelanggan.CustTechCPPosition = createCustomerDto.technical_job_title;
    pelanggan.CustBillCP = createCustomerDto.billing_name;
    pelanggan.CustBillCPPosition = createCustomerDto.billing_job_title;
    pelanggan.CustBillMethodLetter = CUSTOMER_BILLING_METHOD.letter;
    pelanggan.CustBillMethodEmail = CUSTOMER_BILLING_METHOD.email;
    pelanggan.CustBillCPEmail = createCustomerDto.billing_email;
    pelanggan.CustRegDate = new Date(this.getDateNow());
    pelanggan.CustNotes = createCustomerDto.extend_note;
    pelanggan.InsertEmpId = createCustomerDto.approval_emp_id;
    pelanggan.EmpApproval = createCustomerDto.approval_emp_id;
    pelanggan.CustStatus = CUSTOMER_DEFAULT_STATUS;
    pelanggan.SalesId = createCustomerDto.sales_id;
    pelanggan.InsertDateTime = new Date(this.getDateNow());
    pelanggan.UpdateDateTime = new Date(this.getDateNow());
    pelanggan.TaxType = createCustomerDto.tax_type;
    pelanggan.CetakDuluan = createCustomerDto.cetak_duluan;
    pelanggan.ManagerSalesId = createCustomerDto.manager_sales_id;

    return pelanggan;
  }

  async assignCustomerTemp(CustID: string): Promise<CustomerTemp> {
    const findCustomerID = await CustomerTemp.findOne({
      where: {
        CustId: CustID,
      },
    });

    findCustomerID.Taken = 1;

    return findCustomerID;
  }

  async assignCustomerInvoiceSignature(
    createNewCustomerDto: CreateNewCustomerDto,
    CustID,
  ): Promise<CustomerInvoiceSignature> {
    const CustInvoiceSign = new CustomerInvoiceSignature();

    CustInvoiceSign.CustId = CustID;
    CustInvoiceSign.UseSignature = CUSTOMER_DEFAULT_USE_SIGNATURE_ID; // Info dita CRO sales, signature id tidak pernah di rubah selalu default
    CustInvoiceSign.Mark = CUSTOMER_DEFAULT_MARK_SIGNATURE; // Info dita CRO sales, mark signature tidak pernah di rubah selalu default

    return CustInvoiceSign;
  }

  async assignCustomerFix(
    createCustomerDto: CreateNewCustomerDto,
    CustID,
    FormID,
  ): Promise<CustomerFix> {
    const CustFix = new CustomerFix();

    CustFix.CustId = CustID;
    CustFix.CustPass = this.hashPasswordMd5();
    CustFix.BranchId = createCustomerDto.display_branch_id
      ? createCustomerDto.display_branch_id
      : createCustomerDto.branch_id;
    CustFix.FormId = FormID;
    CustFix.CustName = createCustomerDto.full_name;
    CustFix.CustGender = createCustomerDto.gender;
    CustFix.custPOB = createCustomerDto.place_of_birth;
    CustFix.custDOB = createCustomerDto.date_of_birth;
    CustFix.CustIdType = createCustomerDto.identity_type;
    CustFix.CustIdNumber = createCustomerDto.identity_number;
    CustFix.CustJobTitle = createCustomerDto.job_title_personal;
    CustFix.CustResAdd1 = this.addressSplitter(
      createCustomerDto.identity_address,
    )[0];
    CustFix.CustResAdd2 = this.addressSplitter(
      createCustomerDto.identity_address,
    )[1];
    CustFix.CustResCity = createCustomerDto.identity_city;
    CustFix.CustResZC = createCustomerDto.identity_zip_code;
    CustFix.CustCompany =
      createCustomerDto.company_name != null
        ? createCustomerDto.company_name
        : null;
    CustFix.CustBusName =
      createCustomerDto.company_name != null
        ? createCustomerDto.company_name
        : null;
    CustFix.BusId = CUSTOMER_DEFAULT_BUSINESS_TYPE_ID; // BusId adalah Bussiness Id Type di IS dan defaultnya adalah others
    CustFix.CustOfficeAdd1 =
      createCustomerDto.company_address != null
        ? this.addressSplitter(createCustomerDto.company_address)[0]
        : this.addressSplitter(createCustomerDto.installation_address)[0];
    CustFix.CustOfficeAdd2 =
      createCustomerDto.company_address != null
        ? this.addressSplitter(createCustomerDto.company_address)[1]
        : this.addressSplitter(createCustomerDto.installation_address)[1];
    CustFix.CustOfficeCity =
      createCustomerDto.company_address_city != null
        ? createCustomerDto.company_address_city
        : createCustomerDto.installation_address_city;
    CustFix.CustOfficeZC =
      createCustomerDto.company_address_city != null
        ? createCustomerDto.company_address_zip_code
        : createCustomerDto.installation_address_zip_code;
    CustFix.CustBillingAdd = CUSTOMER_BILLING_ADD;
    CustFix.CustTechCP = createCustomerDto.technical_name;
    CustFix.CustTechCPPosition = createCustomerDto.technical_job_title;
    CustFix.CustBillCP = createCustomerDto.billing_name;
    CustFix.CustBillCPPosition = createCustomerDto.billing_job_title;
    CustFix.CustBillCPEmail = createCustomerDto.billing_email;
    CustFix.CustRegDate = new Date(this.getDateNow());
    CustFix.CustNotes = createCustomerDto.extend_note;
    CustFix.InsertEmpId = createCustomerDto.approval_emp_id;
    CustFix.EmpApproval = createCustomerDto.approval_emp_id;
    CustFix.CustStatus = CUSTOMER_DEFAULT_STATUS;
    CustFix.SalesId = createCustomerDto.sales_id;
    CustFix.InsertDateTime = new Date(this.getDateNow());
    CustFix.UpdateDateTime = new Date(this.getDateNow());
    CustFix.TaxType = createCustomerDto.tax_type;

    return CustFix;
  }

  async assignNpwpCust(
    createCustomerDto: CreateNewCustomerDto,
    CustID,
  ): Promise<NPWPCustomer> {
    const npwpCust = new NPWPCustomer();

    npwpCust.Name = createCustomerDto.full_name;
    npwpCust.Address = createCustomerDto.identity_address;
    npwpCust.NPWP = createCustomerDto.npwp_number;
    npwpCust.CustId = CustID;
    npwpCust.Selected = DEFAULT_SELECTED_NPWP_CUSTOMER;

    return npwpCust;
  }

  async assignSmsPhonebook(
    createCustomerDto: CreateNewCustomerDto,
    CustID,
  ): Promise<any> {
    const smsPhoneBook1 = new SMSPhonebook();
    const smsPhoneBook2 = new SMSPhonebook();
    if (createCustomerDto.billing_phone != createCustomerDto.technical_phone) {
      smsPhoneBook1.phone = createCustomerDto.billing_phone;
      smsPhoneBook1.name = createCustomerDto.billing_name.toUpperCase();
      smsPhoneBook1.custId = CustID;
      smsPhoneBook1.billing = DEFAULT_BILLING_SMS_PHONEBOOK_1;
      smsPhoneBook1.technical = DEFAULT_TECHNICAL_SMS_PHONEBOOK_1;
      smsPhoneBook1.salutationid = createCustomerDto.billing_salutation;
      smsPhoneBook1.insertTime = new Date(this.getDateNow());
      smsPhoneBook1.insertBy = createCustomerDto.approval_emp_id;

      smsPhoneBook2.phone = createCustomerDto.technical_phone;
      smsPhoneBook2.name = createCustomerDto.technical_name.toUpperCase();
      smsPhoneBook2.custId = CustID;
      smsPhoneBook2.billing = DEFAULT_BILLING_SMS_PHONEBOOK_2;
      smsPhoneBook2.technical = DEFAULT_TECHNICAL_SMS_PHONEBOOK_2;
      smsPhoneBook2.salutationid = createCustomerDto.technical_salutation;
      smsPhoneBook2.insertTime = new Date(this.getDateNow());
      smsPhoneBook2.insertBy = createCustomerDto.approval_emp_id;
    } else {
      smsPhoneBook1.phone = createCustomerDto.billing_phone;
      smsPhoneBook1.name = createCustomerDto.billing_name.toUpperCase();
      smsPhoneBook1.custId = CustID;
      smsPhoneBook1.billing = DEFAULT_BILLING_SMS_PHONEBOOK_1;
      smsPhoneBook1.technical = DEFAULT_TECHNICAL_SMS_PHONEBOOK_2;
      smsPhoneBook1.salutationid = createCustomerDto.billing_salutation;
      smsPhoneBook1.insertTime = new Date(this.getDateNow());
      smsPhoneBook1.insertBy = createCustomerDto.approval_emp_id;
    }

    return {
      smsPhoneBook1,
      smsPhoneBook2,
    };
  }

  async assignCustomerProfileHistory(
    createCustomerDto: CreateNewCustomerDto,
    CustID,
    FormID,
  ): Promise<CustomerProfileHistory> {
    const CustProfileHistory = new CustomerProfileHistory();

    CustProfileHistory.CustId = CustID;
    CustProfileHistory.CustPass = this.hashPasswordMd5();
    CustProfileHistory.BranchId = createCustomerDto.display_branch_id
      ? createCustomerDto.display_branch_id
      : createCustomerDto.branch_id;
    CustProfileHistory.DisplayBranchId = createCustomerDto.display_branch_id;
    CustProfileHistory.FormId = FormID;
    CustProfileHistory.CustName = createCustomerDto.full_name;
    CustProfileHistory.CustGender = createCustomerDto.gender;
    CustProfileHistory.custPOB = createCustomerDto.place_of_birth;
    CustProfileHistory.custDOB = createCustomerDto.date_of_birth;
    CustProfileHistory.CustIdType = createCustomerDto.identity_type;
    CustProfileHistory.CustIdNumber = createCustomerDto.identity_number;
    CustProfileHistory.CustJobTitle = createCustomerDto.job_title_personal;
    CustProfileHistory.CustResAdd1 = this.addressSplitter(
      createCustomerDto.identity_address,
    )[0];
    CustProfileHistory.CustResAdd2 = this.addressSplitter(
      createCustomerDto.identity_address,
    )[1];
    CustProfileHistory.CustResCity = createCustomerDto.identity_city;
    CustProfileHistory.CustResZC = createCustomerDto.identity_zip_code;
    CustProfileHistory.CustCompany =
      createCustomerDto.company_name != null
        ? createCustomerDto.company_name
        : createCustomerDto.full_name;
    CustProfileHistory.CustBusName =
      createCustomerDto.company_name != null
        ? createCustomerDto.company_name
        : createCustomerDto.full_name;
    CustProfileHistory.BusId = CUSTOMER_DEFAULT_BUSINESS_TYPE_ID; // BusId adalah Bussiness Id Type di IS dan defaultnya adalah others
    CustProfileHistory.CustOfficeAdd1 =
      createCustomerDto.company_address != null
        ? this.addressSplitter(createCustomerDto.company_address)[0]
        : this.addressSplitter(createCustomerDto.installation_address)[0];
    CustProfileHistory.CustOfficeAdd2 =
      createCustomerDto.company_address != null
        ? this.addressSplitter(createCustomerDto.company_address)[1]
        : this.addressSplitter(createCustomerDto.installation_address)[1];
    CustProfileHistory.CustOfficeCity =
      createCustomerDto.company_address_city != null
        ? createCustomerDto.company_address_city
        : createCustomerDto.installation_address_city;
    CustProfileHistory.CustOfficeZC =
      createCustomerDto.company_address_city != null
        ? createCustomerDto.company_address_zip_code
        : createCustomerDto.installation_address_zip_code;
    CustProfileHistory.CustBillingAdd = CUSTOMER_BILLING_ADD;
    CustProfileHistory.CustTechCP = createCustomerDto.technical_name;
    CustProfileHistory.CustTechCPPosition =
      createCustomerDto.technical_job_title;
    CustProfileHistory.CustBillCP = createCustomerDto.billing_name;
    CustProfileHistory.CustBillCPPosition = createCustomerDto.billing_job_title;
    CustProfileHistory.CustBillMethodLetter = CUSTOMER_BILLING_METHOD.letter;
    CustProfileHistory.CustBillMethodEmail = CUSTOMER_BILLING_METHOD.email;
    CustProfileHistory.CustBillCPEmail = createCustomerDto.billing_email;
    CustProfileHistory.CustRegDate = new Date(this.getDateNow());
    CustProfileHistory.CustNotes = createCustomerDto.extend_note;
    CustProfileHistory.InsertEmpId = createCustomerDto.approval_emp_id;
    CustProfileHistory.EmpApproval = createCustomerDto.approval_emp_id;
    CustProfileHistory.CustStatus = CUSTOMER_DEFAULT_STATUS;
    CustProfileHistory.SalesId = createCustomerDto.sales_id;
    CustProfileHistory.InsertDateTime = new Date(this.getDateNow());
    CustProfileHistory.UpdateDateTime = new Date(this.getDateNow());
    CustProfileHistory.TaxType = createCustomerDto.tax_type;
    CustProfileHistory.CetakDuluan = createCustomerDto.cetak_duluan;
    CustProfileHistory.ManagerSalesId = createCustomerDto.manager_sales_id;

    return CustProfileHistory;
  }

  async assignCustomerVerifiedEmail(
    createCustomerDto: CreateNewCustomerDto,
    CustID,
  ): Promise<any> {
    const CustVerifiedEmail1 = new CustomerVerifiedEmail();
    const CustVerifiedEmail2 = new CustomerVerifiedEmail();
    if (createCustomerDto.billing_email != createCustomerDto.technical_email) {
      CustVerifiedEmail1.cust_id = CustID;
      CustVerifiedEmail1.cust_email = createCustomerDto.billing_email;
      CustVerifiedEmail1.email_type = DEFAULT_EMAIL_TYPE_1;
      CustVerifiedEmail1.verified = DEFAULT_VERIFIED_STATUS;

      CustVerifiedEmail2.cust_id = CustID;
      CustVerifiedEmail2.cust_email = createCustomerDto.technical_email;
      CustVerifiedEmail2.email_type = DEFAULT_EMAIL_TYPE_2;
      CustVerifiedEmail2.verified = DEFAULT_VERIFIED_STATUS;
    } else {
      CustVerifiedEmail1.cust_id = CustID;
      CustVerifiedEmail1.cust_email = createCustomerDto.billing_email;
      CustVerifiedEmail1.email_type = DEFAULT_EMAIL_TYPE_1;
      CustVerifiedEmail1.verified = DEFAULT_VERIFIED_STATUS;
    }

    return {
      CustVerifiedEmail1,
      CustVerifiedEmail2,
    };
  }

  async assignCustomerGlobalSearch(
    customerData: Customer,
  ): Promise<CustomerGlobalSearch> {
    const dataPelangganSaveObj = customerData;
    const dataPelangganSaveArr = Object.keys(dataPelangganSaveObj).map(
      (key) => dataPelangganSaveObj[key],
    );
    const saveDataPelangganTextSearch = dataPelangganSaveArr.join(' ');

    const customerGlobalSearch = new CustomerGlobalSearch();

    customerGlobalSearch.custId = customerData.CustId.toString();
    customerGlobalSearch.textSearch = saveDataPelangganTextSearch;

    return customerGlobalSearch;
  }

  async assignSubscription(
    createCustomerDto: CreateNewCustomerDto,
    CustID,
    accName,
  ): Promise<Subscription> {
    const Services = new Subscription();

    Services.CustId = CustID;
    Services.ServiceId = createCustomerDto.package_code;
    Services.ServiceType = createCustomerDto.package_name;
    Services.EmpId = createCustomerDto.approval_emp_id;
    Services.PayId = SERVICE_PAY_ID_METHOD; // PayId adalah sistem metode pembayaran default idnya = '001' dan valuenya = 'Transfer'
    Services.CustStatus = SERVICE_DEFAULT_STATUS;
    Services.CustRegDate = new Date(this.getDateNow());
    Services.CustActivationDate = new Date(this.getDateNow());
    Services.CustUpdateDate = new Date(this.getDateNow());
    Services.CustBlockDate = new Date(this.getDateNow());
    Services.CustBlockFrom = SERVICE_DEFAULT_BLOCK_FROM;
    Services.CustAccName = accName;
    Services.EmpIdEdit = createCustomerDto.approval_emp_id;
    Services.Opsi = SERVICE_DEFAULT_OPTION;
    Services.StartTrial = new Date(this.getDateNow());
    Services.EndTrial = new Date(this.getDateNow());
    Services.StatusPerangkat = SERVICE_DEFAULT_DEVICE_STATUS;
    Services.Gabung = SERVICE_DEFAULT_JOIN_STATUS;
    Services.Tampil = SERVICE_DEFAULT_SHOW_STATUS;
    Services.TglHarga = new Date(this.getDateNow());
    Services.Subscription = createCustomerDto.package_price;
    Services.InvoiceType = (
      await this.getInvoiceTypeMonth(createCustomerDto.package_top)
    ).InvoiceType.toString();
    Services.InvoicePeriod = `${
      ('0' + (new Date(this.getDateNow()).getMonth() + 1)).slice(-2) +
      new Date(this.getDateNow()).getFullYear().toString().slice(-2)
    }`;
    Services.InvoiceDate1 = SERVICE_DEFAULT_INVOICE_DATE_STATUS;
    Services.AddEmailCharge = SERVICE_DEFAULT_ADD_EMAIL_CHARGE_STATUS;
    Services.AccessLog = SERVICE_DEFAULT_ACCESS_LOG_STATUS;
    Services.Description = createCustomerDto.extend_note;
    Services.installation_address =
      createCustomerDto.installation_address.toUpperCase();
    Services.ContractUntil = new Date(this.getDateNow());
    Services.Type = SERVICE_DEFAULT_INSTALLATION_TYPE;
    Services.promo_id = createCustomerDto.promo_id;
    Services.BlockTypeId = SERVICE_DEFAULT_BLOCK_TYPE_STATUS;
    Services.BlockTypeDate = SERVICE_DEFAULT_BLOCK_TYPE_DATE;
    Services.CustBlockFromMenu = SERVICE_DEFAULT_CUSTOMER_BLOCK_FROM_MENU;
    Services.IPServer = SERVICE_DEFAULT_IP_SERVER;
    Services.PPN = createCustomerDto.PPN;

    return Services;
  }

  async getInvoiceTypeMonth(packageTop): Promise<InvoiceTypeMonth> {
    return await InvoiceTypeMonth.createQueryBuilder('itm')
      .select('itm.InvoiceType InvoiceType')
      .where('itm.Month = :month', { month: packageTop })
      .getRawOne();
  }

  async assignCustomerServiceHistoryNew(
    customerDto: CreateNewCustomerDto,
    customerService: Subscription,
  ): Promise<CustomerServicesHistoryNew> {
    const customerServiceHistoryNew = new CustomerServicesHistoryNew();

    customerServiceHistoryNew.cust_serv_id = customerService.ServiceId;
    customerServiceHistoryNew.emp_id = customerDto.approval_emp_id;
    customerServiceHistoryNew.insert_time = new Date(this.getDateNow());
    customerServiceHistoryNew.description = SERVICE_DEFAULT_HISTORY_DESCRIPTION;

    return customerServiceHistoryNew;
  }

  async saveCustomerServiceRepository(
    createNewServiceCustomersDto: CreateNewServiceCustomersDto,
    cid,
  ) {
    let resultUpdateCustService = null;

    // Step 1 : Cek Data Pelanggan
    const dataPelanggan = await this.findOne({ where: { CustId: cid } });

    if (dataPelanggan) {
      // Step 2 : Check Account ID
      let accName = null;
      accName = await this.checkAccountName(
        dataPelanggan.CustName,
        createNewServiceCustomersDto.installation_address,
      );

      const Services = new Subscription();
      Services.CustId = cid;
      Services.ServiceId = createNewServiceCustomersDto.package_code;
      Services.ServiceType = createNewServiceCustomersDto.package_name;
      Services.EmpId = createNewServiceCustomersDto.approval_emp_id;
      Services.PayId = '006';
      Services.CustStatus = 'BL';
      Services.CustRegDate = new Date(this.getDateNow());
      Services.CustActivationDate = new Date(this.getDateNow());
      Services.CustUpdateDate = new Date(this.getDateNow());
      Services.CustBlockDate = new Date(this.getDateNow());
      Services.CustBlockFrom = true;
      Services.CustAccName = accName;
      Services.Opsi = true;
      Services.StartTrial = new Date(this.getDateNow());
      Services.EndTrial = new Date(this.getDateNow());
      Services.StatusPerangkat = 'PM';
      Services.Gabung = false;
      Services.Tampil = true;
      Services.TglHarga = new Date(this.getDateNow());
      Services.Subscription = createNewServiceCustomersDto.package_price;
      const InvoiceType = await this.dataSource.query(`
        SELECT itm.InvoiceType FROM InvoiceTypeMonth itm
        WHERE itm.Month = '${createNewServiceCustomersDto.package_top}'
      `);
      Services.InvoiceType = InvoiceType[0].InvoiceType;
      Services.InvoicePeriod = `${
        ('0' + (new Date(this.getDateNow()).getMonth() + 1)).slice(-2) +
        new Date(this.getDateNow()).getFullYear().toString().slice(-2)
      }`;
      Services.InvoiceDate1 = true;
      Services.AddEmailCharge = false;
      Services.AccessLog = true;
      Services.Description = createNewServiceCustomersDto.extend_note;
      Services.installation_address =
        createNewServiceCustomersDto.installation_address.toUpperCase();
      Services.ContractUntil = new Date(this.getDateNow());
      Services.Type = 'Rumah';
      Services.promo_id = createNewServiceCustomersDto.promo_id;
      Services.BlockTypeId = true;
      Services.BlockTypeDate = '25';
      Services.CustBlockFromMenu = 'edit_subs';

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager.save(Services);
        await queryRunner.commitTransaction();
        resultUpdateCustService = 'Success';
      } catch (error) {
        resultUpdateCustService = null;
      }
    } else {
      resultUpdateCustService = null;
    }

    return resultUpdateCustService;
  }

  addressSplitter(addressStr) {
    return {
      0: addressStr.substring(0, Math.round(addressStr.length / 2)),
      1: addressStr.substring(
        Math.round(addressStr.length / 2),
        addressStr.length,
      ),
    };
  }

  hashPasswordMd5(password = CUSTOMER_DEFAULT_PASSWORD) {
    return md5(password);
  }

  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date) {
    return [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join('-');
  }

  getDateNow() {
    const date = new Date().toLocaleString('id', { timeZone: 'Asia/Jakarta' });
    const dateSplit = date.split(', ');

    let tanggal;
    let jam;
    dateSplit.forEach((el, key) => {
      if (key == 0) {
        tanggal = dateSplit[0].split('/');
      } else {
        jam = dateSplit[1].split('.');
      }
    });

    return tanggal.reverse().join('-') + ' ' + jam.join(':');
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

const CUSTOMER_DEFAULT_PASSWORD = 12345;
const CUSTOMER_DEFAULT_BUSINESS_TYPE_ID = '090';
const CUSTOMER_BILLING_ADD = true;
const CUSTOMER_BILLING_METHOD = {
  letter: false,
  email: true,
};
const CUSTOMER_DEFAULT_STATUS = 'AC';
const CUSTOMER_DEFAULT_USE_SIGNATURE_ID = '020';
const CUSTOMER_DEFAULT_MARK_SIGNATURE = '0';

const DEFAULT_SELECTED_NPWP_CUSTOMER = true;

const DEFAULT_BILLING_SMS_PHONEBOOK_1 = true;
const DEFAULT_TECHNICAL_SMS_PHONEBOOK_1 = false;

const DEFAULT_BILLING_SMS_PHONEBOOK_2 = false;
const DEFAULT_TECHNICAL_SMS_PHONEBOOK_2 = true;

const DEFAULT_EMAIL_TYPE_1 = 'billing';
const DEFAULT_EMAIL_TYPE_2 = 'technical';
const DEFAULT_VERIFIED_STATUS = '0';

const SERVICE_PAY_ID_METHOD = '001';
const SERVICE_DEFAULT_STATUS = 'BL';
const SERVICE_DEFAULT_BLOCK_FROM = true;
const SERVICE_DEFAULT_OPTION = true;
const SERVICE_DEFAULT_DEVICE_STATUS = 'PM';
const SERVICE_DEFAULT_JOIN_STATUS = false;
const SERVICE_DEFAULT_SHOW_STATUS = true;
const SERVICE_DEFAULT_INVOICE_DATE_STATUS = true;
const SERVICE_DEFAULT_ADD_EMAIL_CHARGE_STATUS = false;
const SERVICE_DEFAULT_ACCESS_LOG_STATUS = false;
const SERVICE_DEFAULT_INSTALLATION_TYPE = null;
const SERVICE_DEFAULT_BLOCK_TYPE_STATUS = true;
const SERVICE_DEFAULT_BLOCK_TYPE_DATE = '23';
const SERVICE_DEFAULT_CUSTOMER_BLOCK_FROM_MENU = 'edit_subs';
const SERVICE_DEFAULT_IP_SERVER = '000.000.000.000';

const SERVICE_DEFAULT_HISTORY_DESCRIPTION = 'Registered';
