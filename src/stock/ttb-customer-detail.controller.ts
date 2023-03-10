import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TtbCustomer } from './entities/ttb-customer.entity';
import { TtbCustomerDetailService } from './ttb-customer-detail.service';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stock/ttbs/:id')
export class TtbCustomerDetailController {
  constructor(
    private readonly ttbCustomerDetailService: TtbCustomerDetailService,
  ) {}

  @Get('details')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  show(@Param('id') id: number): Promise<TtbCustomer> {
    return this.ttbCustomerDetailService.findAllTtbCustomerDetails(id);
  }
}
