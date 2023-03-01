import { Injectable } from '@nestjs/common';
import { GetPromoFilterDto } from './dto/get-promo-filter.dto';
import { SalesPromoRepository } from './sales-promo.repository';

@Injectable()
export class SalesPromoService {
  constructor(private salesPromoRepository: SalesPromoRepository) {}

  async getListPromoService(filterPromoDto: GetPromoFilterDto): Promise<any> {
    const { promoIds } = filterPromoDto;

    if (typeof promoIds !== 'undefined' && promoIds.length > 0) {
      return await this.salesPromoRepository.getListPromoByIdRepository(
        promoIds,
      );
    } else {
      return await this.salesPromoRepository.getListPromoRepository(
        filterPromoDto,
      );
    }
  }
}
