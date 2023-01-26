import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CustomerInvoiceSignature } from '../entities/customer-invoice-signature.entity';
import { NewCustomerInitValue } from '../interfaces/new-customer.interface';

@Injectable()
export class CustomerInvoiceSignatureRepository extends Repository<CustomerInvoiceSignature> {
  constructor(private dataSource: DataSource) {
    super(CustomerInvoiceSignature, dataSource.createEntityManager());
  }

  assignCustomerInvoiceSignature(
    newCustomerValue: NewCustomerInitValue,
  ): CustomerInvoiceSignature {
    const CustInvoiceSign = new CustomerInvoiceSignature();
    CustInvoiceSign.CustId = newCustomerValue.custId;
    CustInvoiceSign.UseSignature = CUSTOMER_DEFAULT_USE_SIGNATURE_ID; // Info dita CRO sales, signature id tidak pernah di rubah selalu default
    CustInvoiceSign.Mark = CUSTOMER_DEFAULT_MARK_SIGNATURE; // Info dita CRO sales, mark signature tidak pernah di rubah selalu default
    return CustInvoiceSign;
  }
}

export const CUSTOMER_DEFAULT_USE_SIGNATURE_ID = '020';
export const CUSTOMER_DEFAULT_MARK_SIGNATURE = '0';
