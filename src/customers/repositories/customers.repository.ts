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

    // Step 1 : Init CustID
    let CustID = null;
    CustID = await this.checkCustomerID();

    // Step 2 : Init FormID
    let FormID = null;
    if (createCustomerDto.display_branch_id) {
      FormID = await this.checkFormID(createCustomerDto.display_branch_id);
    } else {
      FormID = await this.checkFormID(createCustomerDto.branch_id);
    }

    // Step 3 : Check Account ID
    let accName = null;
    accName = await this.checkAccountName(createCustomerDto.full_name, CustID);

    if (CustID && FormID) {
      // Step 4 : Assign Data Pelanggan ke Tabel Customer
      const pelanggan = new Customer();
      pelanggan.CustId = CustID;
      pelanggan.CustPass = md5('12345');
      pelanggan.BranchId = createCustomerDto.branch_id;
      pelanggan.DisplayBranchId = createCustomerDto.display_branch_id;
      pelanggan.FormId = FormID;
      pelanggan.CustName = createCustomerDto.full_name.toUpperCase();
      pelanggan.CustGender = createCustomerDto.gender;
      pelanggan.custPOB = createCustomerDto.place_of_birth.toUpperCase();
      pelanggan.custDOB = createCustomerDto.date_of_birth;
      pelanggan.CustIdType = createCustomerDto.identity_type;
      pelanggan.CustIdNumber = createCustomerDto.identity_number;
      pelanggan.CustCompany =
        createCustomerDto.company_name != null
          ? createCustomerDto.company_name.toUpperCase()
          : null;
      pelanggan.CustBusName =
        createCustomerDto.company_name != null
          ? createCustomerDto.company_name.toUpperCase()
          : null;
      pelanggan.BusId = '090';
      pelanggan.CustResAdd1 = createCustomerDto.identity_address.toUpperCase();
      pelanggan.CustResPhone = createCustomerDto.phone_number;
      pelanggan.CustOfficeAdd1 =
        createCustomerDto.company_address != null
          ? createCustomerDto.company_address.toUpperCase()
          : null;
      pelanggan.CustOfficePhone = createCustomerDto.company_phone_number;
      pelanggan.CustBillingAdd = true;
      pelanggan.CustHP = createCustomerDto.phone_number;
      pelanggan.CustEmail = createCustomerDto.email_address;
      pelanggan.CustTechCP = createCustomerDto.technical_name.toUpperCase();
      pelanggan.CustTechCPPhone = createCustomerDto.technical_phone;
      pelanggan.CustTechCPEmail = createCustomerDto.technical_email;
      pelanggan.CustBillCP = createCustomerDto.billing_name.toUpperCase();
      pelanggan.CustBillMethodLetter = false;
      pelanggan.CustBillMethodEmail = true;
      pelanggan.CustBillCPPhone = createCustomerDto.billing_phone;
      pelanggan.CustBillCPEmail = createCustomerDto.billing_email;
      pelanggan.CustRegDate = new Date(this.getDateNow());
      pelanggan.CustNotes = createCustomerDto.extend_note;
      pelanggan.EmpApproval = createCustomerDto.approval_emp_id;
      pelanggan.CustStatus = 'BL';
      pelanggan.SalesId = createCustomerDto.sales_id;
      pelanggan.InsertDateTime = new Date(this.getDateNow());
      pelanggan.UpdateDateTime = new Date(this.getDateNow());
      pelanggan.TaxType = createCustomerDto.tax_type;
      pelanggan.CetakDuluan = createCustomerDto.cetak_duluan;
      pelanggan.ManagerSalesId = createCustomerDto.manager_sales_id;

      // Step 5 : Assign Data Pelanggan ke Tabel CustomerInvoiceSignature
      const CustInvoiceSign = new CustomerInvoiceSignature();
      CustInvoiceSign.CustId = CustID;
      CustInvoiceSign.UseSignature = '020';
      CustInvoiceSign.Mark = '0';

      // Step 6 : Assign Data Pelanggan ke Tabel CustomerInvoiceSignature
      const CustFix = new CustomerFix();
      CustFix.CustId = CustID;
      CustFix.CustPass = md5('12345');
      CustFix.BranchId = createCustomerDto.display_branch_id
        ? createCustomerDto.display_branch_id
        : createCustomerDto.branch_id;
      CustFix.FormId = FormID;
      CustFix.CustName = createCustomerDto.full_name.toUpperCase();
      CustFix.CustGender = createCustomerDto.gender;
      CustFix.custPOB = createCustomerDto.place_of_birth.toUpperCase();
      CustFix.custDOB = createCustomerDto.date_of_birth;
      CustFix.CustIdType = createCustomerDto.identity_type;
      CustFix.CustIdNumber = createCustomerDto.identity_number;
      CustFix.CustCompany =
        createCustomerDto.company_name != null
          ? createCustomerDto.company_name.toUpperCase()
          : null;
      CustFix.CustBusName =
        createCustomerDto.company_name != null
          ? createCustomerDto.company_name.toUpperCase()
          : null;
      CustFix.BusId = '090';
      CustFix.CustResAdd1 = createCustomerDto.identity_address.toUpperCase();
      CustFix.CustResPhone = createCustomerDto.phone_number;
      CustFix.CustOfficeAdd1 =
        createCustomerDto.company_address != null
          ? createCustomerDto.company_address.toUpperCase()
          : null;
      CustFix.CustOfficePhone = createCustomerDto.company_phone_number;
      CustFix.CustBillingAdd = true;
      CustFix.CustHP = createCustomerDto.phone_number;
      CustFix.CustEmail = createCustomerDto.email_address;
      CustFix.CustTechCP = createCustomerDto.technical_name.toUpperCase();
      CustFix.CustTechCPPhone = createCustomerDto.technical_phone;
      CustFix.CustTechCPEmail = createCustomerDto.technical_email;
      CustFix.CustBillCP = createCustomerDto.billing_name.toUpperCase();
      CustFix.CustBillCPPhone = createCustomerDto.billing_phone;
      CustFix.CustBillCPEmail = createCustomerDto.billing_email;
      CustFix.CustRegDate = new Date(this.getDateNow());
      CustFix.CustNotes = createCustomerDto.extend_note;
      CustFix.EmpApproval = createCustomerDto.approval_emp_id;
      CustFix.CustStatus = 'BL';
      CustFix.SalesId = createCustomerDto.sales_id;
      CustFix.InsertDateTime = new Date(this.getDateNow());
      CustFix.UpdateDateTime = new Date(this.getDateNow());
      CustFix.TaxType = createCustomerDto.tax_type;

      // Step 7 : Assign Data Pelanggan ke Tabel CustomerProfileHistory
      const CustProfileHistory = new CustomerProfileHistory();
      CustProfileHistory.CustId = CustID;
      CustProfileHistory.CustPass = md5('12345');
      CustProfileHistory.BranchId = createCustomerDto.branch_id;
      CustProfileHistory.DisplayBranchId = createCustomerDto.display_branch_id;
      CustProfileHistory.FormId = FormID;
      CustProfileHistory.CustName = createCustomerDto.full_name.toUpperCase();
      CustProfileHistory.CustGender = createCustomerDto.gender;
      CustProfileHistory.custPOB =
        createCustomerDto.place_of_birth.toUpperCase();
      CustProfileHistory.custDOB = createCustomerDto.date_of_birth;
      CustProfileHistory.CustIdType = createCustomerDto.identity_type;
      CustProfileHistory.CustIdNumber = createCustomerDto.identity_number;
      CustProfileHistory.CustCompany =
        createCustomerDto.company_name != null
          ? createCustomerDto.company_name.toUpperCase()
          : null;
      CustProfileHistory.CustBusName =
        createCustomerDto.company_name != null
          ? createCustomerDto.company_name.toUpperCase()
          : null;
      CustProfileHistory.BusId = '090';
      CustProfileHistory.CustResAdd1 =
        createCustomerDto.identity_address.toUpperCase();
      CustProfileHistory.CustResPhone = createCustomerDto.phone_number;
      CustProfileHistory.CustOfficeAdd1 =
        createCustomerDto.company_address != null
          ? createCustomerDto.company_address.toUpperCase()
          : null;
      CustProfileHistory.CustOfficePhone =
        createCustomerDto.company_phone_number;
      CustProfileHistory.CustBillingAdd = true;
      CustProfileHistory.CustHP = createCustomerDto.phone_number;
      CustProfileHistory.CustEmail = createCustomerDto.email_address;
      CustProfileHistory.CustTechCP =
        createCustomerDto.technical_name.toUpperCase();
      CustProfileHistory.CustTechCPPhone = createCustomerDto.technical_phone;
      CustProfileHistory.CustTechCPEmail = createCustomerDto.technical_email;
      CustProfileHistory.CustBillCP =
        createCustomerDto.billing_name.toUpperCase();
      CustProfileHistory.CustBillMethodLetter = false;
      CustProfileHistory.CustBillMethodEmail = true;
      CustProfileHistory.CustBillCPPhone = createCustomerDto.billing_phone;
      CustProfileHistory.CustBillCPEmail = createCustomerDto.billing_email;
      CustProfileHistory.CustRegDate = new Date(this.getDateNow());
      CustProfileHistory.CustNotes = createCustomerDto.extend_note;
      CustProfileHistory.EmpApproval = createCustomerDto.approval_emp_id;
      CustProfileHistory.CustStatus = 'BL';
      CustProfileHistory.SalesId = createCustomerDto.sales_id;
      CustProfileHistory.InsertDateTime = new Date(this.getDateNow());
      CustProfileHistory.UpdateDateTime = new Date(this.getDateNow());
      CustProfileHistory.TaxType = createCustomerDto.tax_type;
      CustProfileHistory.CetakDuluan = createCustomerDto.cetak_duluan;
      CustProfileHistory.ManagerSalesId = createCustomerDto.manager_sales_id;

      // Step 8 : Assign Data Pelanggan ke Tabel CustomerVerifiedEmail
      const CustVerifiedEmail1 = new CustomerVerifiedEmail();
      const CustVerifiedEmail2 = new CustomerVerifiedEmail();
      if (
        createCustomerDto.billing_email != createCustomerDto.technical_email
      ) {
        CustVerifiedEmail1.cust_id = CustID;
        CustVerifiedEmail1.cust_email = createCustomerDto.billing_email;
        CustVerifiedEmail1.email_type = 'billing';
        CustVerifiedEmail1.verified = '0';

        CustVerifiedEmail2.cust_id = CustID;
        CustVerifiedEmail2.cust_email = createCustomerDto.technical_email;
        CustVerifiedEmail2.email_type = 'technical';
        CustVerifiedEmail2.verified = '0';
      } else {
        CustVerifiedEmail1.cust_id = CustID;
        CustVerifiedEmail1.cust_email = createCustomerDto.billing_email;
        CustVerifiedEmail1.email_type = 'billing';
        CustVerifiedEmail1.verified = '0';
      }

      // Step 9 : Assign Data Layanan ke Tabel Subscription
      const Services = new Subscription();
      Services.CustId = CustID;
      Services.ServiceId = createCustomerDto.package_code;
      Services.ServiceType = createCustomerDto.package_name;
      Services.EmpId = createCustomerDto.approval_emp_id;
      Services.PayId = '001';
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
      Services.Subscription = createCustomerDto.package_price;
      const InvoiceType = await this.dataSource.query(`
        SELECT itm.InvoiceType FROM InvoiceTypeMonth itm
        WHERE itm.Month = '${createCustomerDto.package_top}'
      `);
      Services.InvoiceType = InvoiceType[0].InvoiceType;
      Services.InvoicePeriod = `${
        ('0' + (new Date(this.getDateNow()).getMonth() + 1)).slice(-2) +
        new Date(this.getDateNow()).getFullYear().toString().slice(-2)
      }`;
      Services.InvoiceDate1 = true;
      Services.AddEmailCharge = false;
      Services.AccessLog = true;
      Services.Description = createCustomerDto.extend_note;
      Services.installation_address =
        createCustomerDto.installation_address.toUpperCase();
      Services.ContractUntil = new Date(this.getDateNow());
      Services.Type = 'Rumah';
      Services.promo_id = createCustomerDto.promo_id;
      Services.BlockTypeId = true;
      Services.BlockTypeDate = '25';
      Services.CustBlockFromMenu = 'edit_subs';
      Services.IPServer = '000.000.000.000';

      // Step 10 : Assign Data NPWP ke Tabel NPWP
      const npwpCust = new NPWPCustomer();
      npwpCust.Name = createCustomerDto.full_name.toUpperCase();
      npwpCust.Address = createCustomerDto.identity_address.toUpperCase();
      npwpCust.NPWP = createCustomerDto.npwp_number;
      npwpCust.CustId = CustID;
      npwpCust.Selected = true;

      // Step 11 : Assign Data SMS Phonebook ke SMS Phonebook
      const smsPhoneBook1 = new SMSPhonebook();
      const smsPhoneBook2 = new SMSPhonebook();
      if (
        createCustomerDto.billing_phone != createCustomerDto.technical_phone
      ) {
        smsPhoneBook1.phone = createCustomerDto.billing_phone;
        smsPhoneBook1.name = createCustomerDto.billing_name.toUpperCase();
        smsPhoneBook1.custId = CustID;
        smsPhoneBook1.billing = true;
        smsPhoneBook1.technical = false;
        smsPhoneBook1.insertTime = new Date(this.getDateNow());
        smsPhoneBook1.insertBy = createCustomerDto.approval_emp_id;

        smsPhoneBook2.phone = createCustomerDto.technical_phone;
        smsPhoneBook2.name = createCustomerDto.technical_name.toUpperCase();
        smsPhoneBook2.custId = CustID;
        smsPhoneBook2.billing = false;
        smsPhoneBook2.technical = true;
        smsPhoneBook2.insertTime = new Date(this.getDateNow());
        smsPhoneBook2.insertBy = createCustomerDto.approval_emp_id;
      } else {
        smsPhoneBook1.phone = createCustomerDto.billing_phone;
        smsPhoneBook1.name = createCustomerDto.billing_name.toUpperCase();
        smsPhoneBook1.custId = CustID;
        smsPhoneBook1.billing = true;
        smsPhoneBook1.technical = true;
        smsPhoneBook1.insertTime = new Date(this.getDateNow());
        smsPhoneBook1.insertBy = createCustomerDto.approval_emp_id;
      }

      // Step 12 : Eksekusi Logic Simpan Pelanggan Baru
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const dataPelangganSaveObj = pelanggan;
        const dataPelangganSaveArr = Object.keys(dataPelangganSaveObj).map(
          (key) => dataPelangganSaveObj[key],
        );
        const saveDataPelangganTextSearch = dataPelangganSaveArr.join(' ');
        await queryRunner.manager.save(pelanggan);
        await queryRunner.manager.query(`UPDATE CustomerTemp SET Taken = 1
        WHERE CustId = '${Services.CustId}'`);
        await queryRunner.manager.save(smsPhoneBook1);
        if (smsPhoneBook1.phone != smsPhoneBook2.phone) {
          await queryRunner.manager.save(smsPhoneBook2);
        }
        await queryRunner.manager.save(npwpCust);
        await queryRunner.manager.save(CustInvoiceSign);
        await queryRunner.manager.save(CustFix);
        await queryRunner.manager.save(CustProfileHistory);
        await queryRunner.manager.save(CustVerifiedEmail1);
        if (CustVerifiedEmail1.cust_email != CustVerifiedEmail2.cust_email) {
          await queryRunner.manager.save(CustVerifiedEmail2);
        }
        await queryRunner.manager
          .query(`INSERT INTO CustomerGlobalSearch (custId, textSearch, flag)
        VALUES ('${Services.CustId}', '${saveDataPelangganTextSearch}', '0')`);
        await queryRunner.manager.save(Services);

        await queryRunner.commitTransaction();

        resultSaveDataCustomer = CustID;
      } catch (error) {
        resultSaveDataCustomer = null;
        await queryRunner.rollbackTransaction();
      }
    }

    return resultSaveDataCustomer;
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
      accName = await this.checkAccountName(dataPelanggan.CustName, cid);

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

  async checkCustomerID() {
    let CustIDResult = '';

    // Step 1 : Ambil Data dari CustomerTemp
    const checkCustIDinTemp = await this.dataSource.query(`
      SELECT * FROM CustomerTemp ct
      WHERE ct.Taken = 0
    `);

    for (const chkCustID of checkCustIDinTemp) {
      const countDataCustID = await this.dataSource.query(`
        SELECT COUNT(c.CustId) 'jumlah_row' FROM Customer c
        WHERE c.CustId = '${chkCustID.CustId}'
      `);

      if (countDataCustID[0].jumlah_row == 0) {
        CustIDResult = chkCustID.CustId;
        break;
      }
    }

    return CustIDResult;
  }

  async checkFormID(branch_id) {
    let FormIDResult = '';

    // Step 1 : Ambil Data dari CustomerTemp
    const fetchDataCustomerLast = await this.dataSource.query(`
      SELECT FormId FROM Customer 
      WHERE IFNULL(DisplayBranchId, BranchId) = '${branch_id}' 
      ORDER BY CustId DESC LIMIT 1
    `);

    const formIDIdentifier = [];
    const resultLastFormID = fetchDataCustomerLast[0].FormId;
    if (/[a-zA-Z]+/g.test(resultLastFormID)) {
      formIDIdentifier['num'] = parseInt(resultLastFormID.match(/\d+/g)) + 1;
      formIDIdentifier['char'] = String(resultLastFormID.match(/[a-zA-Z]+/g));
      FormIDResult = formIDIdentifier['char'].concat(formIDIdentifier['num']);
    } else {
      const number = resultLastFormID;
      if (number.length != parseInt(number).toString().length) {
        FormIDResult = '0' + (parseInt(number) + 1).toString();
      } else {
        FormIDResult = `${parseInt(resultLastFormID.match(/\d+/g)) + 1}`;
      }
    }

    return FormIDResult;
  }

  async checkAccountName(acc_name: string, customer_id: string) {
    const splitStrName = acc_name.split(' ')[0].toLowerCase();
    const timeStamp = new Date().getTime();
    const newAccName = splitStrName + timeStamp;

    // Check in database
    const queryBuilder = await this.dataSource.query(`
      SELECT * FROM CustomerServices cs
      WHERE cs.CustAccName LIKE '%${newAccName}%'
    `);

    if (queryBuilder.length != 0) {
      await this.checkAccountName(acc_name, customer_id);
    } else {
      return newAccName;
    }
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
