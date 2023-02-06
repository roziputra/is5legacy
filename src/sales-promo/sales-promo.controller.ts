import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
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
    try {
      const resultAllPromo = await this.salesPromoService.getAllPromoService(
        filterPromoDto,
      );
      return {
        data: resultAllPromo,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        title: 'Internal Server Error',
        message: 'Failed to load resource. please try again later',
      });
    }
  }

  @Get(':promo_id')
  @HttpCode(200)
  async getDataPromoByID(@Param('promo_id') promo_id) {
    try {
      const resultPromoByID = await this.salesPromoService.getPromoByIDService(
        promo_id,
      );
      return {
        data: resultPromoByID,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        title: 'Internal Server Error',
        message: 'Failed to load resource. please try again later',
      });
    }
  }
}
