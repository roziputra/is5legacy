import { HttpStatus, Injectable } from '@nestjs/common';
import { Is5LegacyException } from 'src/exceptions/is5-legacy.exception';
import { TtbCustomerRepository } from './repositories/ttb-customer.repository';
import { TtbCustomerDetailRepository } from './repositories/ttb-customer-detail.repository';

@Injectable()
export class TtbCustomerDetailService {
  constructor(
    private readonly ttbCustomerRepository: TtbCustomerRepository,
    private readonly ttbCustomerDetailRepository: TtbCustomerDetailRepository,
  ) {}

  async findAllTtbCustomerDetails(id: number) {
    const ttbCustomer = await this.ttbCustomerRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!ttbCustomer) {
      throw new Is5LegacyException(
        'TTB customer tidak ditemukan',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.ttbCustomerDetailRepository.findAllDetails(id);
  }
}
