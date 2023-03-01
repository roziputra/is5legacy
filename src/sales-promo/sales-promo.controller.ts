import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { GetPromoFilterDto } from './dto/get-promo-filter.dto';
import { SalesPromoService } from './sales-promo.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('api-key'))
@Controller('promos')
export class SalesPromoController {
  constructor(private salesPromoService: SalesPromoService) {}

  @Get()
  @HttpCode(200)
  async getAllDataPromo(@Query() filterPromoDto: GetPromoFilterDto) {
    const resultPromo = await this.salesPromoService.getListPromoService(
      filterPromoDto,
    );

    return {
      data: resultPromo,
    };
  }
}
