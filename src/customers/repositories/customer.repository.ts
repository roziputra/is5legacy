import { Repository, DataSource } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { Subscription } from '../entities/subscriber.entity';
import { CustomerServiceTechnicalCustom } from '../entities/customer-service-technical-custom.entity';
import { NOCFiber } from '../entities/noc-fiber.entity';
import { Injectable } from '@nestjs/common';
import { CustomerTemp } from '../entities/customer-temp.entity';
import { CreateNewServiceCustomersDto } from '../dtos/create-service-customer.dto';

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

  async getNewCustomerId(): Promise<any> {
    let custIdResult = null;

    const fetchCustomerTemp = await CustomerTemp.createQueryBuilder('ct')
      .select('ct.CustId customer_id')
      .leftJoin('Customer', 'c', 'ct.CustId = c.CustId')
      .where('ct.Taken = 0 AND c.CustId <=> NULL')
      .orderBy('ct.CustId', 'ASC')
      .limit(1)
      .getRawMany();

    custIdResult = fetchCustomerTemp[0].customer_id;

    return custIdResult;
  }

  async getLastFormId(branchId: string): Promise<any> {
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

    formIdResult = fetchDataCustomerLast[0].FormId;

    return formIdResult;
  }

  async checkAccountName(accName: string): Promise<Subscription[]> {
    return await Subscription.find({
      where: {
        CustAccName: accName,
      },
    });
  }

  async getAccountName(fullName: string, address: string): Promise<any> {
    let resultAccName = null;
    const fullNameStr = fullName.toLowerCase().split(' ')[0];
    const randNumber = Math.floor(1000 + Math.random() * 9000);
    resultAccName = fullNameStr + randNumber;

    const checkAccName = await this.checkAccountName(resultAccName);

    if (checkAccName.length > 0) {
      await this.getAccountName(fullName, address);
    }

    return resultAccName;
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
      accName = await this.getAccountName(
        dataPelanggan.CustName,
        createNewServiceCustomersDto.installationAddress,
      );

      const Services = new Subscription();
      Services.CustId = cid;
      Services.ServiceId = createNewServiceCustomersDto.packageCode;
      Services.ServiceType = createNewServiceCustomersDto.packageName;
      Services.EmpId = createNewServiceCustomersDto.approvalEmpId;
      Services.PayId = '006';
      Services.CustStatus = 'BL';
      Services.CustRegDate = new Date();
      Services.CustActivationDate = new Date();
      Services.CustUpdateDate = new Date();
      Services.CustBlockDate = new Date();
      Services.CustBlockFrom = true;
      Services.CustAccName = accName;
      Services.Opsi = true;
      Services.StartTrial = new Date();
      Services.EndTrial = new Date();
      Services.StatusPerangkat = 'PM';
      Services.Gabung = false;
      Services.Tampil = true;
      Services.TglHarga = new Date();
      Services.Subscription = createNewServiceCustomersDto.packagePrice;
      const InvoiceType = await this.dataSource.query(`
        SELECT itm.InvoiceType FROM InvoiceTypeMonth itm
        WHERE itm.Month = '${createNewServiceCustomersDto.packageTop}'
      `);
      Services.InvoiceType = InvoiceType[0].InvoiceType;
      Services.InvoicePeriod = `${
        ('0' + (new Date().getMonth() + 1)).slice(-2) +
        new Date().getFullYear().toString().slice(-2)
      }`;
      Services.InvoiceDate1 = true;
      Services.AddEmailCharge = false;
      Services.AccessLog = true;
      Services.Description = createNewServiceCustomersDto.extendNote;
      Services.installation_address =
        createNewServiceCustomersDto.installationAddress.toUpperCase();
      Services.ContractUntil = new Date();
      Services.Type = 'Rumah';
      Services.promo_id = createNewServiceCustomersDto.promoId;
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
