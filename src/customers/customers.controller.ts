import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomersService } from './customers.service';
import { Query } from '@nestjs/common';
import { OperatorSubscriptionInterceptor } from './interceptors/operator-subscription.interceptor';
import { GetOperatorSubscriptionDto } from './dtos/get-operator-subscription.dto';
import { CreateNewCustomerDto } from './dtos/create-customer.dto';
import { CreateNewServiceCustomersDto } from './dtos/create-service-customer.dto';
import { Is5LegacyException } from '../exceptions/is5-legacy.exception';

@UseGuards(AuthGuard('api-key'))
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('operator-subscriptions')
  @UseInterceptors(OperatorSubscriptionInterceptor)
  async getOperatorSubscription(
    @Query(new ValidationPipe({ transform: true }))
    getOperatorSubscriptionDto: GetOperatorSubscriptionDto,
  ): Promise<any> {
    return this.customersService.getOperatorSubscriptions(
      getOperatorSubscriptionDto,
    );
  }

  @Get(':customer_id')
  @HttpCode(200)
  async getCustomerDetail(@Param('customer_id') customerId): Promise<any> {
    const resultAllCustomers = await this.customersService.getCustomerServices(
      customerId,
    );
    if (Object.keys(resultAllCustomers).length !== 0)
      return {
        data: resultAllCustomers,
      };
    else {
      throw new NotFoundException('Data pelanggan tidak ditemukan');
    }
  }

  @Post()
  @HttpCode(201)
  async saveNewCustomer(
    @Body() createNewCustomerDto: CreateNewCustomerDto,
  ): Promise<any> {
    const saveNewCustomer = await this.customersService.saveNewCustomerServices(
      createNewCustomerDto,
    );
    if (saveNewCustomer)
      return {
        title: 'Berhasil',
        message: 'Berhasil menyimpan data pelanggan',
        data: {
          id: saveNewCustomer,
        },
      };
    else {
      throw new Is5LegacyException(
        {
          title: 'Error',
          message: 'Pendaftaran pelanggan tidak dapat diproses',
        },
        500,
      );
    }
  }

  @Post(':customer_id/services')
  @HttpCode(201)
  async saveDataCustServices(
    @Param('customer_id') customer_id,
    @Body() createNewServiceCustomersDto: CreateNewServiceCustomersDto,
  ): Promise<any> {
    const saveNewServiceCustomer =
      await this.customersService.saveNewCustomerServiceServices(
        createNewServiceCustomersDto,
        customer_id,
      );
    if (saveNewServiceCustomer)
      return {
        title: 'Berhasil',
        message: 'Berhasil menambahkan data layanan pelanggan',
      };
    else {
      throw new Is5LegacyException(
        {
          title: 'Error',
          message: 'Data pelanggan tidak dapat ditemukan',
        },
        404,
      );
    }
  }
}
