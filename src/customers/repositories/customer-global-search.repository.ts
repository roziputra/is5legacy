import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { CustomerGlobalSearch } from '../entities/customer-global-search.entity';
import { NewCustomerInitValue } from '../interfaces/new-customer.interface';

@Injectable()
export class CustomerGlobalSearchRepository extends Repository<CustomerGlobalSearch> {
  constructor(private dataSource: DataSource) {
    super(CustomerGlobalSearch, dataSource.createEntityManager());
  }

  assignCustomerGlobalSearch(
    newCustomerValue: NewCustomerInitValue,
  ): CustomerGlobalSearch {
    const dataPelangganSaveObj = newCustomerValue;
    const dataPelangganSaveArr = Object.keys(dataPelangganSaveObj).map(
      (key) => dataPelangganSaveObj[key],
    );
    const saveDataPelangganTextSearch = dataPelangganSaveArr.join(' ');
    const customerGlobalSearch = new CustomerGlobalSearch();
    customerGlobalSearch.custId = newCustomerValue.custId;
    customerGlobalSearch.textSearch = saveDataPelangganTextSearch;

    return customerGlobalSearch;
  }
}
