// List Of Common NestJS Package
import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

// List of Dto
import { CreateNewCustomerDto } from './dtos/create-customer.dto';
import { CreateNewServiceCustomersDto } from './dtos/create-service-customer.dto';
import { GetCustomerSalutationDto } from './dtos/get-customer-salutation.dto';

// List of Repository
import {
  DEFAULT_EMAIL_TYPE_1,
  DEFAULT_EMAIL_TYPE_2,
  DEFAULT_VERIFIED_STATUS,
} from './repositories/customer-verified-email.repository';
import {
  SERVICE_DEFAULT_ACCESS_LOG_STATUS,
  SERVICE_DEFAULT_ADD_EMAIL_CHARGE_STATUS,
  SERVICE_DEFAULT_BLOCK_FROM,
  SERVICE_DEFAULT_BLOCK_TYPE_DATE,
  SERVICE_DEFAULT_BLOCK_TYPE_STATUS,
  SERVICE_DEFAULT_CUSTOMER_BLOCK_FROM_MENU,
  SERVICE_DEFAULT_DEVICE_STATUS,
  SERVICE_DEFAULT_INSTALLATION_TYPE,
  SERVICE_DEFAULT_INVOICE_DATE_STATUS,
  SERVICE_DEFAULT_IP_SERVER,
  SERVICE_DEFAULT_JOIN_STATUS,
  SERVICE_DEFAULT_OPTION,
  SERVICE_DEFAULT_SHOW_STATUS,
  SERVICE_DEFAULT_STATUS,
  SERVICE_PAY_ID_METHOD,
} from './repositories/customer-subsription.repository';
import { SERVICE_DEFAULT_HISTORY_DESCRIPTION } from './repositories/customer-service-history.repository';
import {
  DEFAULT_BILLING_SMS_PHONEBOOK_1,
  DEFAULT_BILLING_SMS_PHONEBOOK_2,
  DEFAULT_TECHNICAL_SMS_PHONEBOOK_1,
  DEFAULT_TECHNICAL_SMS_PHONEBOOK_2,
} from './repositories/customer-phonebook.repository';
import { DEFAULT_SELECTED_NPWP_CUSTOMER } from './repositories/customer-npwp.repository';
import {
  CUSTOMER_DEFAULT_MARK_SIGNATURE,
  CUSTOMER_DEFAULT_USE_SIGNATURE_ID,
} from './repositories/customer-invoice-signature.repository';
import {
  CUSTOMER_BILLING_ADD,
  CUSTOMER_BILLING_METHOD,
  CUSTOMER_DEFAULT_BUSINESS_TYPE_ID,
  CUSTOMER_DEFAULT_STATUS,
  CustomerRepository,
  DEFAULT_FACTOR_GENERATE_CUSTOMER_ID,
} from './repositories/customer.repository';
import {
  SERVICE_INVOICE_TYPE_OTC,
  SERVICE_CONTRACT_END_OTC,
} from './repositories/customer-subsription.repository';

// List of Entity
import { Customer } from './entities/customer.entity';
import { CustomerTemp } from './entities/customer-temp.entity';
import { CustomerInvoiceSignature } from './entities/customer-invoice-signature.entity';
import { CustomerFix } from './entities/customer-fix.entity';
import { NPWPCustomer } from './entities/customer-npwp.entity';
import { SMSPhonebook } from './entities/sms-phonebook.entity';
import { Subscription } from './entities/subscriber.entity';
import { CustomerGlobalSearch } from './entities/customer-global-search.entity';
import { CustomerProfileHistory } from './entities/customer-profile-history.entity';
import { CustomerServicesHistoryNew } from './entities/customer-service-history-new.entity';
import { CustomerVerifiedEmail } from './entities/customer-verified-email.entity';
import { InvoiceTypeMonth } from './entities/invoice-type-month.entity';
import { CustomerSalutation } from './entities/salutation.entity';
import { CustomerSysConf } from './entities/sysconf.entity';
import { GetCustomerListDto } from './dtos/get-customer-list.dto';

// List of Another Package
import { hashPasswordMd5 } from '../utils/md5-hashing.util';
import { Is5LegacyException } from '../exceptions/is5-legacy.exception';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class CustomersService {
  constructor(
    private customerRepository: CustomerRepository,
    private dataSource: DataSource,
  ) {}

  async getListSalutationService(
    getCustomerSalutationDto: GetCustomerSalutationDto,
  ): Promise<any> {
    const { salutationIds } = getCustomerSalutationDto;
    if (salutationIds) {
      return await this.customerRepository.getCustomerSalutationRepository(
        salutationIds,
      );
    } else {
      return await CustomerSalutation.find();
    }
  }

  async getListCustomerServices(
    options: IPaginationOptions,
    getCustomerListDto: GetCustomerListDto,
  ): Promise<Pagination<Customer>> {
    const { customerIds } = getCustomerListDto;
    return this.customerRepository.getCustomerListRepository(
      options,
      customerIds,
    );
  }

  async saveNewCustomerServices(
    createNewCustomerDto: CreateNewCustomerDto,
  ): Promise<any> {
    let resultSaveDataCustomer = null;

    // Step 1 : Init CustID
    let custId = null;
    const fetchNewCustomerId = await this.customerRepository.getNewCustomerId();
    if (fetchNewCustomerId) {
      custId = fetchNewCustomerId.CustId;
    } else {
      custId = await this.generateCustomerId(createNewCustomerDto.branchId);
    }

    // Step 2 : Init FormID
    let formId = null;
    if (createNewCustomerDto.displayBranchId) {
      formId = await this.getNewFormId(createNewCustomerDto.displayBranchId);
    } else {
      formId = await this.getNewFormId(createNewCustomerDto.branchId);
    }

    // Step 3 : Check Account ID
    let accName = null;
    accName = await this.getAccountName(
      createNewCustomerDto.fullName,
      createNewCustomerDto.installationAddress,
    );

    if (custId != null && formId != null) {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      let customerData = null;
      let customerFix = null;
      let npwpCustomer = null;
      let smsPhonebook = null;
      let customerProfileHistory = null;
      let customerService = null;
      let customerServiceHistoryNew = null;

      try {
        // Step 4 : Assign Data Pelanggan ke Tabel Customer dan Simpan
        customerData = await this.saveNewCustomer(
          queryRunner,
          createNewCustomerDto,
          custId,
          formId,
        );

        // Step 5 : Update Customer Temp To Taken = 1
        let customerTemp = null;
        customerTemp = await this.updateCustomerTemp(queryRunner, custId);

        // Step 6 : Assign Data Pelanggan ke Tabel CustomerInvoiceSignature dan Simpan
        let customerInvoiceSign = null;
        customerInvoiceSign = await this.saveCustomerInvoiceSignature(
          queryRunner,
          custId,
        );

        // Step 7 : Assign Data Pelanggan ke Tabel CustomerFix dan Simpan
        customerFix = await this.saveCustomerFix(
          queryRunner,
          createNewCustomerDto,
          custId,
          formId,
        );

        // Step 8 : Assign Data NPWP ke Tabel NPWP dan Simpan
        npwpCustomer = await this.saveNpwpCustomer(
          queryRunner,
          createNewCustomerDto,
          custId,
        );

        // Step 9 : Assign Data SMS Phonebook ke SMS Phonebook dan Simpan
        smsPhonebook = await this.saveSmsPhonebook(
          queryRunner,
          createNewCustomerDto,
          custId,
        );

        // Step 10 : Assign Data Pelanggan ke Tabel CustomerProfileHistory
        customerProfileHistory = await this.saveCustomerProfileHistory(
          queryRunner,
          createNewCustomerDto,
          customerData.AI,
          custId,
          formId,
        );

        // Step 11 : Assign Data Pelanggan ke Tabel CustomerVerifiedEmail
        let customerVerifiedEmail = null;
        customerVerifiedEmail = await this.saveCustomerVerifiedEmail(
          queryRunner,
          createNewCustomerDto,
          custId,
        );

        // Step 12 : Assign Data Pelanggan ke Tabel CustomerGlobalSearch
        let customerGlobalSearch = null;
        createNewCustomerDto['custId'] = custId;
        createNewCustomerDto['formId'] = formId;
        createNewCustomerDto = JSON.parse(JSON.stringify(createNewCustomerDto));
        customerGlobalSearch = await this.saveCustomerGlobalSearch(
          queryRunner,
          createNewCustomerDto,
          custId,
        );

        // Step 13 : Assign Data Layanan ke Tabel CustomerService
        customerService = await this.saveCustomerService(
          queryRunner,
          createNewCustomerDto,
          custId,
          accName,
        );

        // Step 14 : Assign Data Pelanggan ke Tabel CustomerServiceHistoryNew
        customerServiceHistoryNew = await this.saveCustomerServiceHistoryNew(
          queryRunner,
          createNewCustomerDto,
          customerService,
        );

        await queryRunner.commitTransaction();

        resultSaveDataCustomer = {
          customerId: custId,
          customerServiceId: (
            await Subscription.findOne({
              select: {
                id: true,
              },
              where: {
                CustId: custId,
              },
            })
          ).id.toString(),
        };
      } catch (error) {
        if (customerData) {
          await queryRunner.manager.remove(customerData);
        }
        if (customerFix) {
          await queryRunner.manager.remove(customerFix);
        }
        if (npwpCustomer) {
          await queryRunner.manager.remove(npwpCustomer);
        }
        if (smsPhonebook) {
          if (
            createNewCustomerDto.billingPhone !=
            createNewCustomerDto.technicalPhone
          ) {
            await queryRunner.manager.remove(smsPhonebook.saveSmsPhonebook1);
            await queryRunner.manager.remove(smsPhonebook.saveSmsPhonebook2);
          } else {
            await queryRunner.manager.remove(smsPhonebook.saveSmsPhonebook1);
          }
        }
        if (customerProfileHistory) {
          await queryRunner.manager.remove(customerProfileHistory);
        }
        if (customerService) {
          await queryRunner.manager.remove(customerService);
        }
        if (customerServiceHistoryNew) {
          await queryRunner.manager.remove(customerServiceHistoryNew);
        }
        await queryRunner.rollbackTransaction();
        resultSaveDataCustomer = null;

        throw new Is5LegacyException(
          'Pendaftaran pelanggan tidak dapat diproses, silahkan coba beberapa saat lagi.',
          500,
        );
      }
    }

    return resultSaveDataCustomer;
  }

  async saveNewCustomerServiceServices(
    createNewServiceCustDto: CreateNewServiceCustomersDto,
    custId: string,
  ): Promise<any> {
    let resultUpdateCustService = null;

    // Step 1 : Cek Data Pelanggan
    const dataPelanggan = await this.customerRepository.findOne({
      where: { CustId: custId },
    });

    if (dataPelanggan) {
      // Step 2 : Check Account ID
      let accName = null;
      accName = await this.getAccountName(
        dataPelanggan.CustName,
        createNewServiceCustDto.installationAddress,
      );

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      let serviceData = null;
      let serviceHistory = null;
      try {
        serviceData = await this.saveCustomerService(
          queryRunner,
          createNewServiceCustDto,
          custId,
          accName,
        );

        serviceHistory = await this.saveCustomerServiceHistoryNew(
          queryRunner,
          createNewServiceCustDto,
          serviceData,
        );
        await queryRunner.commitTransaction();

        resultUpdateCustService = {
          customerServiceId: serviceData.id,
        };
      } catch (error) {
        if (serviceData) {
          await queryRunner.manager.remove(serviceData);
        }
        if (serviceHistory) {
          await queryRunner.manager.remove(serviceHistory);
        }
        await queryRunner.rollbackTransaction();

        resultUpdateCustService = null;
        throw new Is5LegacyException(
          'Pendaftaran layanan pelanggan gagal diproses. Silahkan coba lagi!',
          500,
        );
      }
    } else {
      resultUpdateCustService = null;
      throw new Is5LegacyException('Data pelanggan tidak dapat ditemukan', 404);
    }

    return resultUpdateCustService;
  }

  async getNewFormId(branchId: string): Promise<any> {
    let formIdResult = null;

    const getLastFormId = await this.customerRepository.getLastFormId(branchId);

    if (/[a-zA-Z]+/g.test(getLastFormId)) {
      const formIdIdentifier = [];
      formIdIdentifier['str'] = getLastFormId.match(/[a-zA-Z]+/g);
      formIdIdentifier['num'] =
        parseInt(getLastFormId.match(/[0-9]+/g).toString()) + 1;
      formIdResult = formIdIdentifier['str'] + formIdIdentifier['num'];
    } else {
      const number = getLastFormId;
      formIdResult = (parseInt(number) + 1).toString();
    }

    return formIdResult;
  }

  async getAccountName(fullName: string, address: string): Promise<any> {
    let resultAccName = null;
    const fullNameStr = fullName.toLowerCase().split(' ')[0];
    const randNumber = Math.floor(1000 + Math.random() * 9000);
    resultAccName = fullNameStr + randNumber;

    const checkAccName = await this.customerRepository.checkAccountName(
      resultAccName,
    );

    if (checkAccName.length > 0) {
      await this.getAccountName(fullName, address);
    }

    return resultAccName;
  }

  async saveNewCustomer(
    transaction: QueryRunner,
    createNewCustomerDto: CreateNewCustomerDto,
    custId: string,
    formId: string,
  ): Promise<any> {
    const customer = new Customer();

    customer.CustId = custId;
    customer.CustPass = hashPasswordMd5();
    customer.BranchId = createNewCustomerDto.branchId;
    customer.DisplayBranchId = createNewCustomerDto.displayBranchId;
    customer.FormId = formId;
    customer.CustName = createNewCustomerDto.fullName;
    customer.CustGender = createNewCustomerDto.gender;
    customer.custPOB = createNewCustomerDto.placeOfBirth;
    customer.custDOB = createNewCustomerDto.dateOfBirth;
    customer.CustIdType = createNewCustomerDto.identityType;
    customer.CustIdNumber = createNewCustomerDto.identityNumber;
    customer.CustJobTitle = createNewCustomerDto.jobTitlePersonal;
    customer.CustResAdd1 = createNewCustomerDto.identityAddress;
    customer.CustResCity = createNewCustomerDto.identityCity;
    customer.CustResZC = createNewCustomerDto.identityZipCode;
    customer.CustCompany =
      createNewCustomerDto.companyName != null
        ? createNewCustomerDto.companyName
        : createNewCustomerDto.fullName;
    customer.CustBusName =
      createNewCustomerDto.companyName != null
        ? createNewCustomerDto.companyName
        : createNewCustomerDto.fullName;
    customer.BusId = CUSTOMER_DEFAULT_BUSINESS_TYPE_ID; // BusId adalah Bussiness Id Type di IS dan defaultnya adalah others
    customer.CustOfficeAdd1 =
      createNewCustomerDto.companyAddress != null
        ? createNewCustomerDto.companyAddress
        : createNewCustomerDto.installationAddress;
    customer.CustOfficeCity =
      createNewCustomerDto.companyAddressCity != null
        ? createNewCustomerDto.companyAddressCity
        : createNewCustomerDto.installationAddressCity;
    customer.CustOfficeZC =
      createNewCustomerDto.companyAddressZipCode != null
        ? createNewCustomerDto.companyAddressZipCode
        : createNewCustomerDto.installationAddressZipCode;
    customer.CustBillingAdd = CUSTOMER_BILLING_ADD;
    customer.CustTechCP = createNewCustomerDto.technicalName;
    customer.CustTechCPPosition = createNewCustomerDto.technicalJobTitle;
    customer.CustBillCP = createNewCustomerDto.billingName;
    customer.CustBillCPPosition = createNewCustomerDto.billingJobTitle;
    customer.CustBillMethodLetter = CUSTOMER_BILLING_METHOD.letter;
    customer.CustBillMethodEmail = CUSTOMER_BILLING_METHOD.email;
    customer.CustBillCPEmail = createNewCustomerDto.billingEmail;
    customer.CustRegDate = new Date();
    customer.InsertEmpId = createNewCustomerDto.approvalEmpId;
    customer.EmpApproval = createNewCustomerDto.approvalEmpId;
    customer.CustStatus = CUSTOMER_DEFAULT_STATUS;
    customer.SalesId = createNewCustomerDto.salesId;
    customer.InsertDateTime = new Date();
    customer.UpdateDateTime = new Date();
    customer.TaxType = createNewCustomerDto.taxType;
    customer.CetakDuluan = createNewCustomerDto.cetakDuluan;
    customer.ManagerSalesId = createNewCustomerDto.managerSalesId;

    return await transaction.manager.save(customer);
  }

  async updateCustomerTemp(
    transaction: QueryRunner,
    customerId: string,
  ): Promise<any> {
    const customerTemp = new CustomerTemp();

    customerTemp.CustId = customerId;
    customerTemp.Taken = 1;

    return await transaction.manager.save(customerTemp);
  }

  async saveCustomerInvoiceSignature(
    transaction: QueryRunner,
    customerId: string,
  ): Promise<any> {
    const customerInvoiceSign = new CustomerInvoiceSignature();

    customerInvoiceSign.CustId = customerId;
    customerInvoiceSign.UseSignature = CUSTOMER_DEFAULT_USE_SIGNATURE_ID; // Info dita CRO sales, signature id tidak pernah di rubah selalu default
    customerInvoiceSign.Mark = CUSTOMER_DEFAULT_MARK_SIGNATURE; // Info dita CRO sales, mark signature tidak pernah di rubah selalu default

    return await transaction.manager.save(customerInvoiceSign);
  }

  async saveCustomerFix(
    transaction: QueryRunner,
    createNewCustomerDto: CreateNewCustomerDto,
    custId: string,
    formId: string,
  ): Promise<any> {
    const customerFix = new CustomerFix();

    customerFix.CustId = custId;
    customerFix.CustPass = hashPasswordMd5();
    customerFix.BranchId = createNewCustomerDto.displayBranchId
      ? createNewCustomerDto.displayBranchId
      : createNewCustomerDto.branchId;
    customerFix.FormId = formId;
    customerFix.CustName = createNewCustomerDto.fullName;
    customerFix.CustGender = createNewCustomerDto.gender;
    customerFix.custPOB = createNewCustomerDto.placeOfBirth;
    customerFix.custDOB = createNewCustomerDto.dateOfBirth;
    customerFix.CustIdType = createNewCustomerDto.identityType;
    customerFix.CustIdNumber = createNewCustomerDto.identityNumber;
    customerFix.CustJobTitle = createNewCustomerDto.jobTitlePersonal;
    customerFix.CustResAdd1 = createNewCustomerDto.identityAddress;
    customerFix.CustResCity = createNewCustomerDto.identityCity;
    customerFix.CustResZC = createNewCustomerDto.identityZipCode;
    customerFix.CustCompany =
      createNewCustomerDto.companyName != null
        ? createNewCustomerDto.companyName
        : createNewCustomerDto.fullName;
    customerFix.CustBusName =
      createNewCustomerDto.companyName != null
        ? createNewCustomerDto.companyName
        : createNewCustomerDto.fullName;
    customerFix.BusId = CUSTOMER_DEFAULT_BUSINESS_TYPE_ID; // BusId adalah Bussiness Id Type di IS dan defaultnya adalah others
    customerFix.CustOfficeAdd1 =
      createNewCustomerDto.companyAddress != null
        ? createNewCustomerDto.companyAddress
        : createNewCustomerDto.installationAddress;
    customerFix.CustOfficeCity =
      createNewCustomerDto.companyAddressCity != null
        ? createNewCustomerDto.companyAddressCity
        : createNewCustomerDto.installationAddressCity;
    customerFix.CustOfficeZC =
      createNewCustomerDto.companyAddressZipCode != null
        ? createNewCustomerDto.companyAddressZipCode
        : createNewCustomerDto.installationAddressZipCode;
    customerFix.CustBillingAdd = CUSTOMER_BILLING_ADD;
    customerFix.CustTechCP = createNewCustomerDto.technicalName;
    customerFix.CustTechCPPosition = createNewCustomerDto.technicalJobTitle;
    customerFix.CustTechCPEmail = createNewCustomerDto.technicalEmail;
    customerFix.CustBillCP = createNewCustomerDto.billingName;
    customerFix.CustBillCPPosition = createNewCustomerDto.billingJobTitle;
    customerFix.CustBillCPEmail = createNewCustomerDto.billingEmail;
    customerFix.CustRegDate = new Date();
    customerFix.CustNotes = createNewCustomerDto.extendNote;
    customerFix.InsertEmpId = createNewCustomerDto.approvalEmpId;
    customerFix.EmpApproval = createNewCustomerDto.approvalEmpId;
    customerFix.CustStatus = CUSTOMER_DEFAULT_STATUS;
    customerFix.SalesId = createNewCustomerDto.salesId;
    customerFix.InsertDateTime = new Date();
    customerFix.UpdateDateTime = new Date();
    customerFix.TaxType = createNewCustomerDto.taxType;

    return await transaction.manager.save(customerFix);
  }

  async saveNpwpCustomer(
    transaction: QueryRunner,
    createNewCustomerDto: CreateNewCustomerDto,
    custId: string,
  ): Promise<any> {
    const npwpCust = new NPWPCustomer();

    npwpCust.Name = createNewCustomerDto.companyName;
    npwpCust.Address = createNewCustomerDto.companyAddress;
    npwpCust.NPWP = createNewCustomerDto.npwpNumber
      ? createNewCustomerDto.npwpNumber
      : '';
    npwpCust.CustId = custId;
    npwpCust.Selected = DEFAULT_SELECTED_NPWP_CUSTOMER;

    return await transaction.manager.save(npwpCust);
  }

  async saveSmsPhonebook(
    transaction: QueryRunner,
    createNewCustomerDto: CreateNewCustomerDto,
    custId: string,
  ): Promise<any> {
    const smsPhoneBook1 = new SMSPhonebook();
    const smsPhoneBook2 = new SMSPhonebook();

    if (
      createNewCustomerDto.billingPhone != createNewCustomerDto.technicalPhone
    ) {
      smsPhoneBook1.phone = createNewCustomerDto.billingPhone;
      smsPhoneBook1.name = createNewCustomerDto.billingName;
      smsPhoneBook1.custId = custId;
      smsPhoneBook1.billing = DEFAULT_BILLING_SMS_PHONEBOOK_1;
      smsPhoneBook1.technical = DEFAULT_TECHNICAL_SMS_PHONEBOOK_1;
      smsPhoneBook1.salutationid = createNewCustomerDto.billingSalutation;
      smsPhoneBook1.insertTime = new Date();
      smsPhoneBook1.insertBy = createNewCustomerDto.approvalEmpId;

      smsPhoneBook2.phone = createNewCustomerDto.technicalPhone;
      smsPhoneBook2.name = createNewCustomerDto.technicalName;
      smsPhoneBook2.custId = custId;
      smsPhoneBook2.billing = DEFAULT_BILLING_SMS_PHONEBOOK_2;
      smsPhoneBook2.technical = DEFAULT_TECHNICAL_SMS_PHONEBOOK_2;
      smsPhoneBook2.salutationid = createNewCustomerDto.technicalSalutation;
      smsPhoneBook2.insertTime = new Date();
      smsPhoneBook2.insertBy = createNewCustomerDto.approvalEmpId;

      const saveSmsPhonebook1 = await transaction.manager.save(smsPhoneBook1);
      const saveSmsPhonebook2 = await transaction.manager.save(smsPhoneBook2);

      return {
        saveSmsPhonebook1,
        saveSmsPhonebook2,
      };
    } else {
      smsPhoneBook1.phone = createNewCustomerDto.billingPhone;
      smsPhoneBook1.name = createNewCustomerDto.billingName;
      smsPhoneBook1.custId = custId;
      smsPhoneBook1.billing = DEFAULT_BILLING_SMS_PHONEBOOK_1;
      smsPhoneBook1.technical = DEFAULT_TECHNICAL_SMS_PHONEBOOK_2;
      smsPhoneBook1.salutationid = createNewCustomerDto.billingSalutation;
      smsPhoneBook1.insertTime = new Date();
      smsPhoneBook1.insertBy = createNewCustomerDto.approvalEmpId;

      const saveSmsPhonebook1 = await transaction.manager.save(smsPhoneBook1);

      return { saveSmsPhonebook1 };
    }
  }

  async saveCustomerProfileHistory(
    transaction: QueryRunner,
    createNewCustomerDto: CreateNewCustomerDto,
    custAI: number,
    custId: string,
    formId: string,
  ): Promise<any> {
    const custProfileHistory = new CustomerProfileHistory();

    custProfileHistory.AI = custAI;
    custProfileHistory.CustId = custId;
    custProfileHistory.CustPass = hashPasswordMd5();
    custProfileHistory.BranchId = createNewCustomerDto.displayBranchId
      ? createNewCustomerDto.displayBranchId
      : createNewCustomerDto.branchId;
    custProfileHistory.DisplayBranchId = createNewCustomerDto.displayBranchId;
    custProfileHistory.FormId = formId;
    custProfileHistory.CustName = createNewCustomerDto.fullName;
    custProfileHistory.CustGender = createNewCustomerDto.gender;
    custProfileHistory.custPOB = createNewCustomerDto.placeOfBirth;
    custProfileHistory.custDOB = createNewCustomerDto.dateOfBirth;
    custProfileHistory.CustIdType = createNewCustomerDto.identityType;
    custProfileHistory.CustIdNumber = createNewCustomerDto.identityNumber;
    custProfileHistory.CustJobTitle = createNewCustomerDto.jobTitlePersonal;
    custProfileHistory.CustResAdd1 = createNewCustomerDto.identityAddress;
    custProfileHistory.CustResCity = createNewCustomerDto.identityCity;
    custProfileHistory.CustResZC = createNewCustomerDto.identityZipCode;
    custProfileHistory.CustCompany =
      createNewCustomerDto.companyName != null
        ? createNewCustomerDto.companyName
        : createNewCustomerDto.fullName;
    custProfileHistory.CustBusName =
      createNewCustomerDto.companyName != null
        ? createNewCustomerDto.companyName
        : createNewCustomerDto.fullName;
    custProfileHistory.BusId = CUSTOMER_DEFAULT_BUSINESS_TYPE_ID; // BusId adalah Bussiness Id Type di IS dan defaultnya adalah others
    custProfileHistory.CustOfficeAdd1 =
      createNewCustomerDto.companyAddress != null
        ? createNewCustomerDto.companyAddress
        : createNewCustomerDto.installationAddress;
    custProfileHistory.CustOfficeCity =
      createNewCustomerDto.companyAddressCity != null
        ? createNewCustomerDto.companyAddressCity
        : createNewCustomerDto.installationAddressCity;
    custProfileHistory.CustOfficeZC =
      createNewCustomerDto.companyAddressZipCode != null
        ? createNewCustomerDto.companyAddressZipCode
        : createNewCustomerDto.installationAddressZipCode;
    custProfileHistory.CustBillingAdd = CUSTOMER_BILLING_ADD;
    custProfileHistory.CustTechCP = createNewCustomerDto.technicalName;
    custProfileHistory.CustTechCPPosition =
      createNewCustomerDto.technicalJobTitle;
    custProfileHistory.CustBillCP = createNewCustomerDto.billingName;
    custProfileHistory.CustBillCPPosition =
      createNewCustomerDto.billingJobTitle;
    custProfileHistory.CustBillMethodLetter = CUSTOMER_BILLING_METHOD.letter;
    custProfileHistory.CustBillMethodEmail = CUSTOMER_BILLING_METHOD.email;
    custProfileHistory.CustBillCPEmail = createNewCustomerDto.billingEmail;
    custProfileHistory.CustRegDate = new Date();
    custProfileHistory.CustNotes = createNewCustomerDto.extendNote;
    custProfileHistory.InsertEmpId = createNewCustomerDto.approvalEmpId;
    custProfileHistory.EmpApproval = createNewCustomerDto.approvalEmpId;
    custProfileHistory.HistoryInsertEmpId = createNewCustomerDto.approvalEmpId;
    custProfileHistory.CustStatus = CUSTOMER_DEFAULT_STATUS;
    custProfileHistory.SalesId = createNewCustomerDto.salesId;
    custProfileHistory.InsertDateTime = new Date();
    custProfileHistory.HistoryInsertTime = new Date();
    custProfileHistory.UpdateDateTime = new Date();
    custProfileHistory.TaxType = createNewCustomerDto.taxType;
    custProfileHistory.CetakDuluan = createNewCustomerDto.cetakDuluan;
    custProfileHistory.ManagerSalesId = createNewCustomerDto.managerSalesId;

    return await transaction.manager.save(custProfileHistory);
  }

  async saveCustomerVerifiedEmail(
    transaction: QueryRunner,
    createNewCustomerDto: CreateNewCustomerDto,
    custId: string,
  ): Promise<any> {
    const custVerifiedEmail1 = new CustomerVerifiedEmail();
    const custVerifiedEmail2 = new CustomerVerifiedEmail();

    if (
      createNewCustomerDto.billingEmail != createNewCustomerDto.technicalEmail
    ) {
      custVerifiedEmail1.cust_id = custId;
      custVerifiedEmail1.cust_email = createNewCustomerDto.billingEmail;
      custVerifiedEmail1.email_type = DEFAULT_EMAIL_TYPE_1;
      custVerifiedEmail1.verified = DEFAULT_VERIFIED_STATUS;

      custVerifiedEmail2.cust_id = custId;
      custVerifiedEmail2.cust_email = createNewCustomerDto.technicalEmail;
      custVerifiedEmail2.email_type = DEFAULT_EMAIL_TYPE_2;
      custVerifiedEmail2.verified = DEFAULT_VERIFIED_STATUS;

      const saveCustVerifiedEmail1 = await transaction.manager.save(
        custVerifiedEmail1,
      );
      const saveCustVerifiedEmail2 = await transaction.manager.save(
        custVerifiedEmail2,
      );

      return {
        saveCustVerifiedEmail1,
        saveCustVerifiedEmail2,
      };
    } else {
      custVerifiedEmail1.cust_id = custId;
      custVerifiedEmail1.cust_email = createNewCustomerDto.billingEmail;
      custVerifiedEmail1.email_type = DEFAULT_EMAIL_TYPE_1;
      custVerifiedEmail1.verified = DEFAULT_VERIFIED_STATUS;

      const saveCustVerifiedEmail1 = await transaction.manager.save(
        custVerifiedEmail1,
      );

      return {
        saveCustVerifiedEmail1,
      };
    }
  }

  async saveCustomerGlobalSearch(
    transaction: QueryRunner,
    createNewCustomerDto: CreateNewCustomerDto,
    custId: string,
  ): Promise<any> {
    const dataPelangganSaveObj = createNewCustomerDto;
    const dataPelangganSaveArr = Object.keys(dataPelangganSaveObj).map(
      (key) => dataPelangganSaveObj[key],
    );
    const saveDataPelangganTextSearch = dataPelangganSaveArr.join(' ');

    const customerGlobalSearch = new CustomerGlobalSearch();

    customerGlobalSearch.custId = custId;
    customerGlobalSearch.textSearch = saveDataPelangganTextSearch;

    return await transaction.manager.save(customerGlobalSearch);
  }

  async saveCustomerService(
    transaction: QueryRunner,
    createNewServiceCustomerDto: CreateNewServiceCustomersDto,
    custId: string,
    accName: string,
  ): Promise<any> {
    const services = new Subscription();

    services.CustId = custId;
    services.ServiceId = createNewServiceCustomerDto.packageCode;
    services.ServiceType = createNewServiceCustomerDto.packageName;
    services.EmpId = createNewServiceCustomerDto.approvalEmpId;
    services.PayId = SERVICE_PAY_ID_METHOD; // PayId adalah sistem metode pembayaran default idnya = '001' dan valuenya = 'Transfer'
    services.CustStatus = SERVICE_DEFAULT_STATUS;
    services.CustRegDate = new Date();
    services.CustActivationDate = new Date();
    services.CustUpdateDate = new Date();
    services.CustBlockDate = new Date();
    services.CustBlockFrom = SERVICE_DEFAULT_BLOCK_FROM;
    services.CustAccName = accName;
    services.EmpIdEdit = createNewServiceCustomerDto.approvalEmpId;
    services.Opsi = SERVICE_DEFAULT_OPTION;
    services.StartTrial = new Date();
    services.EndTrial = new Date();
    services.StatusPerangkat = SERVICE_DEFAULT_DEVICE_STATUS;
    services.Gabung = SERVICE_DEFAULT_JOIN_STATUS;
    services.Tampil = SERVICE_DEFAULT_SHOW_STATUS;
    services.TglHarga = new Date();
    services.Subscription = createNewServiceCustomerDto.packagePrice;
    if (
      createNewServiceCustomerDto.packageTop == 'OTC' &&
      createNewServiceCustomerDto.contractEnd == 'OTC'
    ) {
      services.InvoiceType = SERVICE_INVOICE_TYPE_OTC;
      services.ContractUntil = SERVICE_CONTRACT_END_OTC;
    } else {
      services.InvoiceType = (
        await InvoiceTypeMonth.findOne({
          where: {
            Month: parseInt(createNewServiceCustomerDto.packageTop),
          },
        })
      ).InvoiceType.toString();
      services.ContractUntil = new Date(
        createNewServiceCustomerDto.contractEnd,
      );
    }
    services.InvoicePeriod = createNewServiceCustomerDto.firstInvoicePeriod;
    services.InvoiceDate1 = SERVICE_DEFAULT_INVOICE_DATE_STATUS;
    services.AddEmailCharge = SERVICE_DEFAULT_ADD_EMAIL_CHARGE_STATUS;
    services.AccessLog = SERVICE_DEFAULT_ACCESS_LOG_STATUS;
    services.Description = createNewServiceCustomerDto.extendNote;
    services.CustNotes = createNewServiceCustomerDto.extendNote;
    services.Notes = createNewServiceCustomerDto.extendNote;
    services.Surveyor = createNewServiceCustomerDto.surveyorId;
    services.installation_address =
      createNewServiceCustomerDto.installationAddress;
    services.Type = SERVICE_DEFAULT_INSTALLATION_TYPE;
    services.promo_id = createNewServiceCustomerDto.promoId;
    services.BlockTypeId = SERVICE_DEFAULT_BLOCK_TYPE_STATUS;
    services.BlockTypeDate = SERVICE_DEFAULT_BLOCK_TYPE_DATE;
    services.CustBlockFromMenu = SERVICE_DEFAULT_CUSTOMER_BLOCK_FROM_MENU;
    services.IPServer = SERVICE_DEFAULT_IP_SERVER;
    services.PPN = createNewServiceCustomerDto.ppn;
    services.CustCloseReason = ' ';

    return await transaction.manager.save(services);
  }

  async saveCustomerServiceHistoryNew(
    transaction: QueryRunner,
    createNewServiceCustomerDto: CreateNewServiceCustomersDto,
    customerService,
  ): Promise<any> {
    const customerServiceHistoryNew = new CustomerServicesHistoryNew();

    customerServiceHistoryNew.cust_serv_id = customerService.id;
    customerServiceHistoryNew.emp_id =
      createNewServiceCustomerDto.approvalEmpId;
    customerServiceHistoryNew.insert_time = new Date();
    customerServiceHistoryNew.description = SERVICE_DEFAULT_HISTORY_DESCRIPTION;

    return await transaction.manager.save(customerServiceHistoryNew);
  }

  async generateCustomerId(branchId): Promise<any> {
    let newCustomerId = null;

    const fetchNewCustomerId = await this.customerRepository.getNewCustomerId();
    if (fetchNewCustomerId != null) {
      newCustomerId = fetchNewCustomerId.CustId;
    } else {
      try {
        const fetchLastInsertedId = await CustomerSysConf.findOne({
          where: {
            BranchId: branchId,
          },
        });

        let baseNumber = parseInt(fetchLastInsertedId.LastRec);
        const lastRecordID = branchId + '0' + baseNumber.toString();
        const factor = DEFAULT_FACTOR_GENERATE_CUSTOMER_ID;

        const lastRec = [];
        const factorRec = [];
        const step = [];
        let total = 0;
        for (let i = 0; i < 9; i++) {
          lastRec[i] = lastRecordID[i];
          factorRec[i] = factor[i];
          step[i] = parseInt(lastRecordID[i]) * parseInt(factor[i]);
          total += step[i];
        }

        const reminder = total % 11;
        let validation = null;
        if (reminder == 0 || reminder == 1) {
          validation = reminder;
        } else {
          validation = 11 - reminder;
        }
        baseNumber = baseNumber + 1;

        const newCustId = lastRecordID + validation;
        const newBaseNumber = '0' + baseNumber;

        await CustomerSysConf.update(
          { LastRec: fetchLastInsertedId.LastRec },
          { LastRec: newBaseNumber },
        );
        await this.insertCustomerTemp(newCustId);

        newCustomerId = newCustId;

        return await this.generateCustomerId(branchId);
      } catch (error) {
        newCustomerId = null;
      }
    }

    return newCustomerId;
  }

  async insertCustomerTemp(newCustId): Promise<any> {
    const custTempNew = CustomerTemp.create({
      CustId: newCustId,
      Taken: 0,
      InsertBy: 'SYSTEM',
      InsertTime: new Date(),
    });
    return await CustomerTemp.insert(custTempNew);
  }
}
