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
    FormID = await this.checkFormID();

    // Step 3 : Check Account ID
    let accName = null;
    accName = await this.checkAccountName(createCustomerDto.full_name, CustID);

    // Step 4 : Assign Data Pelanggan ke Tabel Customer
    const pelanggan = new Customer();
    if (CustID && FormID) {
      pelanggan.CustId = CustID;
      pelanggan.BranchId = createCustomerDto.branch_id;
      pelanggan.DisplayBranchId = createCustomerDto.display_branch_id;
      pelanggan.FormId = FormID;
      pelanggan.CustName = createCustomerDto.full_name;
      pelanggan.CustGender = createCustomerDto.gender;
      pelanggan.custPOB = createCustomerDto.place_of_birth;
      pelanggan.custDOB = createCustomerDto.date_of_birth;
      pelanggan.CustIdType = createCustomerDto.identity_type;
      pelanggan.CustIdNumber = createCustomerDto.identity_number;
      pelanggan.CustCompany = createCustomerDto.company_name;
      pelanggan.CustBusName = createCustomerDto.company_name;
      pelanggan.BusId = '090';
      pelanggan.CustResAdd1 = createCustomerDto.identity_address;
      pelanggan.CustResPhone = createCustomerDto.phone_number;
      pelanggan.CustOfficeAdd1 = createCustomerDto.company_address;
      pelanggan.CustOfficePhone = createCustomerDto.company_phone_number;
      pelanggan.CustBillingAdd = true;
      pelanggan.CustHP = createCustomerDto.phone_number;
      pelanggan.CustEmail = createCustomerDto.email_address;
      pelanggan.CustTechCP = createCustomerDto.technical_name;
      pelanggan.CustTechCPPhone = createCustomerDto.technical_phone;
      pelanggan.CustTechCPEmail = createCustomerDto.technical_email;
      pelanggan.CustBillCP = createCustomerDto.billing_name;
      pelanggan.CustBillMethodLetter = false;
      pelanggan.CustBillMethodEmail = true;
      pelanggan.CustBillCPPhone = createCustomerDto.billing_phone;
      pelanggan.CustBillCPEmail = createCustomerDto.billing_email;
      pelanggan.CustRegDate = new Date(this.getDateNow());
      pelanggan.CustNotes = createCustomerDto.extend_note;
      pelanggan.EmpApproval = createCustomerDto.approval_emp_id;
      pelanggan.CustStatus = 'AC';
      pelanggan.SalesId = createCustomerDto.sales_id;
      pelanggan.InsertDateTime = new Date(this.getDateNow());
      pelanggan.UpdateDateTime = new Date(this.getDateNow());
      pelanggan.TaxType = createCustomerDto.tax_type;
      pelanggan.CetakDuluan = createCustomerDto.cetak_duluan;
      pelanggan.ManagerSalesId = createCustomerDto.manager_sales_id;

      // Step 4 : Assign Data Layanan ke Tabel Customer Service
      const Services = new Subscription();
      Services.CustId = CustID;
      Services.ServiceId = createCustomerDto.package_code;
      Services.ServiceType = createCustomerDto.package_name;
      Services.EmpId = createCustomerDto.approval_emp_id;
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
      Services.installation_address = createCustomerDto.installation_address;
      Services.ContractUntil = new Date(this.getDateNow());
      Services.Type = 'Rumah';
      Services.promo_id = createCustomerDto.promo_id;
      Services.BlockTypeId = true;
      Services.BlockTypeDate = '25';
      Services.CustBlockFromMenu = 'edit_subs';

      // Step 5 : Assign Data NPWP ke Tabel NPWP
      const npwpCust = new NPWPCustomer();
      npwpCust.Name = createCustomerDto.full_name;
      npwpCust.Address = createCustomerDto.identity_address;
      npwpCust.NPWP = createCustomerDto.npwp_number;
      npwpCust.CustId = CustID;
      npwpCust.Selected = true;

      // Step 6 : Assign Data SMS Phonebook ke SMS Phonebook
      const smsPhoneBook1 = new SMSPhonebook();
      smsPhoneBook1.phone = createCustomerDto.billing_phone;
      smsPhoneBook1.name = createCustomerDto.billing_name;
      smsPhoneBook1.custId = CustID;
      smsPhoneBook1.billing = true;
      smsPhoneBook1.technical = false;
      smsPhoneBook1.insertTime = new Date(this.getDateNow());
      smsPhoneBook1.insertBy = createCustomerDto.approval_emp_id;
      const smsPhoneBook2 = new SMSPhonebook();
      smsPhoneBook2.phone = createCustomerDto.technical_phone;
      smsPhoneBook2.name = createCustomerDto.technical_name;
      smsPhoneBook2.custId = CustID;
      smsPhoneBook2.billing = false;
      smsPhoneBook2.technical = true;
      smsPhoneBook2.insertTime = new Date(this.getDateNow());
      smsPhoneBook2.insertBy = createCustomerDto.approval_emp_id;

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
        await queryRunner.manager.save(smsPhoneBook1);
        if (smsPhoneBook1.phone != smsPhoneBook2.phone) {
          await queryRunner.manager.save(smsPhoneBook2);
        }
        await queryRunner.manager.save(Services);
        await queryRunner.manager.save(npwpCust);
        await queryRunner.manager.query(`UPDATE CustomerTemp SET Taken = 1
        WHERE CustId = '${Services.CustId}'`);
        await queryRunner.manager
          .query(`INSERT INTO CustomerGlobalSearch (custId, textSearch, flag)
        VALUES ('${Services.CustId}', '${saveDataPelangganTextSearch}', '0')`);
        await queryRunner.commitTransaction();

        resultSaveDataCustomer = CustID;
      } catch (error) {
        resultSaveDataCustomer = null;
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
        createNewServiceCustomersDto.installation_address;
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

  async checkFormID() {
    let FormIDResult = '';

    // Step 1 : Ambil Data dari CustomerTemp
    const fetchDataCustomerLast = await this.dataSource.query(`
      SELECT (c.FormId) FROM Customer c
      ORDER BY c.FormId DESC
      LIMIT 1
    `);

    const formIDIdentifier = [];
    const resultLastFormID = fetchDataCustomerLast[0].FormId;
    formIDIdentifier['num'] = parseInt(resultLastFormID.match(/\d+/g)) + 1;
    formIDIdentifier['char'] = String(resultLastFormID.match(/[a-zA-Z]+/g));
    FormIDResult = formIDIdentifier['char'].concat(formIDIdentifier['num']);

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
    const dateSplit = date.split(' ');

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
