import { Injectable } from '@nestjs/common';
import { CustomerRepository } from './repositories/customer.repository';
import { GetOperatorSubscriptionDto } from './dtos/get-operator-subscription.dto';
import { NOCFiberRepository } from 'src/customers/repositories/noc-fiber.repository';
import { OperatorSubscriptionRepository } from './repositories/operator-subscription.repository';
import { CreateNewCustomerDto } from './dtos/create-customer.dto';
import { CreateNewServiceCustomersDto } from './dtos/create-service-customer.dto';
import { CustomerVerifiedEmailRepository } from './repositories/customer-verified-email.repository';
import { CustomerTempRepository } from './repositories/customer-temp.repository';
import { CustomerSubscriptionRepository } from './repositories/customer-subsription.repository';
import { CustomerServiceHistoryRepository } from './repositories/customer-service-history.repository';
import { CustomerProfileHistoryRepository } from './repositories/customer-profile-history.repository';
import { CustomerPhonebookRepository } from './repositories/customer-phonebook.repository';
import { CustomerNpwpRepository } from './repositories/customer-npwp.repository';
import { CustomerInvoiceSignatureRepository } from './repositories/customer-invoice-signature.repository';
import { CustomerGlobalSearchRepository } from './repositories/customer-global-search.repository';
import { CustomerFixRepository } from './repositories/customer-fix.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class CustomersService {
  constructor(
    private customerRepository: CustomerRepository,
    private customerVerifiedEmailRepository: CustomerVerifiedEmailRepository,
    private customerTempRepository: CustomerTempRepository,
    private customerSubscriptionRepository: CustomerSubscriptionRepository,
    private customerServiceHistoryRepository: CustomerServiceHistoryRepository,
    private customerProfileHistoryRepository: CustomerProfileHistoryRepository,
    private customerPhonebookRepository: CustomerPhonebookRepository,
    private customerNpwpRepository: CustomerNpwpRepository,
    private customerInvoiceSignatureRepository: CustomerInvoiceSignatureRepository,
    private customerGlobalSearchRepository: CustomerGlobalSearchRepository,
    private customerFixRepository: CustomerFixRepository,
    private operatorSubscription: OperatorSubscriptionRepository,
    private nocFiberRepository: NOCFiberRepository,
    private dataSource: DataSource,
  ) {}

  async getOperatorSubscriptions(
    getOperatorSubscriptionDto: GetOperatorSubscriptionDto,
  ): Promise<any> {
    const { branchIds, status, vendorIds } = getOperatorSubscriptionDto;
    const NocFiberIds = await this.nocFiberRepository.getNocFiberId(
      branchIds,
      vendorIds,
    );
    const ArrayNocFiberIds = NocFiberIds.map((item) => item.id);
    return this.operatorSubscription.getOperatorSubscription(
      ArrayNocFiberIds,
      status,
    );
  }

  async getCustomerServices(customerId) {
    return await this.customerRepository.getCustomerRepository(customerId);
  }

  async saveNewCustomerServices(
    createNewCustomerDto: CreateNewCustomerDto,
  ): Promise<any> {
    let resultSaveDataCustomer = null;

    // Step 1 : Check Customer with same identity
    let searchCustomerExist = null;
    searchCustomerExist =
      await this.customerRepository.searchCustomerByIdentityNum(
        createNewCustomerDto.identityNumber,
      );
    if (searchCustomerExist) {
      resultSaveDataCustomer = searchCustomerExist;
    }

    // // Step 2 : Init CustID
    let custId = null;
    custId = await this.customerRepository.generateCustomerId();

    // Step 3 : Init FormID
    let formId = null;
    if (createNewCustomerDto.displayBranchId) {
      formId = await this.customerRepository.checkFormID(
        createNewCustomerDto.displayBranchId,
      );
    } else {
      formId = await this.customerRepository.checkFormID(
        createNewCustomerDto.branchId,
      );
    }

    // Step 4 : Check Account ID
    let accName = null;
    accName = await this.customerRepository.checkAccountName(
      createNewCustomerDto.fullName,
      createNewCustomerDto.installationAddress,
    );

    createNewCustomerDto['custId'] = custId;
    createNewCustomerDto['formId'] = formId;
    const newAssignValueCustomer = JSON.parse(
      JSON.stringify(createNewCustomerDto),
    );

    // Step 5 : Assign Data Pelanggan ke Tabel Customer
    let customerData = null;
    customerData = await this.customerRepository.assignCustomerData(
      newAssignValueCustomer,
    );

    // Step 6 : Update Customer Temp To Taken = 1
    let customerTakenCustID = null;
    customerTakenCustID = await this.customerTempRepository.assignCustomerTemp(
      custId,
    );

    // Step 7 : Assign Data Pelanggan ke Tabel CustomerInvoiceSignature
    let customerInvoiceSign = null;
    customerInvoiceSign =
      await this.customerInvoiceSignatureRepository.assignCustomerInvoiceSignature(
        newAssignValueCustomer,
      );

    // Step 8 : Assign Data Pelanggan ke Tabel CustomerFix
    let customerFix = null;
    customerFix = await this.customerFixRepository.assignCustomerFixValue(
      newAssignValueCustomer,
    );

    // Step 9 : Assign Data NPWP ke Tabel NPWP
    let npwpCustomer = null;
    npwpCustomer = await this.customerNpwpRepository.assignNpwpCust(
      newAssignValueCustomer,
    );

    // Step 10 : Assign Data SMS Phonebook ke SMS Phonebook
    let smsPhonebook = null;
    smsPhonebook = await this.customerPhonebookRepository.assignSmsPhonebook(
      newAssignValueCustomer,
    );

    // Step 11 : Assign Data Pelanggan ke Tabel CustomerProfileHistory
    let customerProfileHistory = null;
    customerProfileHistory =
      await this.customerProfileHistoryRepository.assignCustomerProfileHistory(
        newAssignValueCustomer,
      );

    // Step 12 : Assign Data Pelanggan ke Tabel CustomerVerifiedEmail
    let customerVerifiedEmail = null;
    customerVerifiedEmail =
      await this.customerVerifiedEmailRepository.assignCustomerVerifiedEmail(
        newAssignValueCustomer,
      );

    // Step 13 : Assign Data Pelanggan ke Tabel CustomerGlobalSearch
    let customerGlobalSearch = null;
    customerGlobalSearch =
      await this.customerGlobalSearchRepository.assignCustomerGlobalSearch(
        newAssignValueCustomer,
      );

    // Step 14 : Assign Data Layanan ke Tabel CustomerService
    let customerService = null;
    customerService =
      await this.customerSubscriptionRepository.assignSubscription(
        newAssignValueCustomer,
        accName,
      );

    // Step 15 : Assign Data Pelanggan ke Tabel CustomerServiceHistoryNew
    let customerServiceHistoryNew = null;
    customerServiceHistoryNew =
      await this.customerServiceHistoryRepository.assignCustomerServiceHistoryNew(
        newAssignValueCustomer,
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
      console.log(error);
      resultSaveDataCustomer = null;
      await queryRunner.rollbackTransaction();
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
      accName = await this.customerRepository.checkAccountName(
        dataPelanggan.CustName,
        createNewServiceCustDto.installationAddress,
      );

      createNewServiceCustDto['custId'] = custId;
      const newAssignValueCustomerService = JSON.parse(
        JSON.stringify(createNewServiceCustDto),
      );

      let serviceData = null;
      serviceData =
        await this.customerSubscriptionRepository.assignSubscription(
          newAssignValueCustomerService,
          accName,
        );

      let serviceHistory = null;
      serviceHistory =
        await this.customerServiceHistoryRepository.assignCustomerServiceHistoryNew(
          newAssignValueCustomerService,
          serviceData,
        );

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager.save(serviceData);
        await queryRunner.manager.save(serviceHistory);
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
}
