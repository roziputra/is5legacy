import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { TtbCustomer } from '../entities/ttb-customer.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Services } from 'src/services/entities/service.entity';

@Injectable()
export class TtbCustomerRepository extends Repository<TtbCustomer> {
  constructor(private dataSource: DataSource) {
    super(TtbCustomer, dataSource.createEntityManager());
  }
  findOneTtb(id: number): Promise<TtbCustomer> {
    return this.findTtbQuery()
      .where('ttb.id = :id', { id: id })
      .select([
        'ttb.id',
        'ttb.noSurat',
        'ttb.ticketId',
        'ttb.date',
        'ttb.branchId',
        'ttb.approvedDate',
      ])
      .addSelect(['c.CustId', 'c.CustName', 'c.CustCompany'])
      .addSelect(['cs.id', 'cs.CustAccName', 'cs.installation_address'])
      .addSelect(['s.id', 's.ServiceType'])
      .addSelect(['sl.EmpId', 'sl.EmpFName', 'sl.EmpLName'])
      .addSelect(['en.EmpId', 'en.EmpFName', 'en.EmpLName'])
      .addSelect(['ap.EmpId', 'ap.EmpFName', 'ap.EmpLName'])
      .addSelect('ttb.approvedDate')
      .getOne();
  }

  findAllTtb(): Promise<TtbCustomer[]> {
    return this.findTtbQuery()
      .select([
        'ttb.id',
        'ttb.noSurat',
        'ttb.ticketId',
        'ttb.date',
        'ttb.branchId',
      ])
      .addSelect(['c.CustId', 'c.CustName', 'c.CustCompany'])
      .addSelect(['cs.id', 'cs.CustAccName', 'cs.installation_address'])
      .addSelect(['s.id', 's.ServiceType'])
      .addSelect(['sl.EmpId', 'sl.EmpFName', 'sl.EmpLName'])
      .addSelect(['en.EmpId', 'en.EmpFName', 'en.EmpLName'])
      .addSelect(['ap.EmpId', 'ap.EmpFName', 'ap.EmpLName'])
      .getMany();
  }

  findTtbQuery(): SelectQueryBuilder<TtbCustomer> {
    return this.createQueryBuilder('ttb')
      .leftJoinAndMapOne('ttb.approved', 'ttb.approved', 'ap')
      .leftJoinAndMapOne('ttb.customerService', 'ttb.customerService', 'cs')
      .leftJoinAndMapOne('ttb.customer', Customer, 'c', 'c.CustId = cs.CustId')
      .leftJoinAndMapOne('ttb.service', Services, 's', 's.id = cs.ServiceId')
      .leftJoinAndMapOne('ttb.sales', 'ttb.sales', 'sl')
      .leftJoinAndMapOne('ttb.engineer', 'ttb.engineer', 'en');
  }
}
