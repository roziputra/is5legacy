import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomersService } from './customers.service';
import { CreateNewCustomerDto } from './dtos/create-customer.dto';
import { CreateNewServiceCustomersDto } from './dtos/create-service-customer.dto';

@UseGuards(AuthGuard('api-key'))
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('salutations')
  async getListSalutation(): Promise<any> {
    const resultAllSalutations =
      await this.customersService.getListSalutationService();
    if (Object.keys(resultAllSalutations).length !== 0)
      return {
        data: resultAllSalutations,
      };
    else {
      throw new NotFoundException('Data salutation tidak ditemukan');
    }
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
          customer_id: saveNewCustomer.customerId,
          customer_service_id: saveNewCustomer.customerServiceId,
        },
      };
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
    if (saveNewServiceCustomer) {
      return {
        title: 'Berhasil',
        message: 'Berhasil menambahkan data layanan pelanggan',
        data: {
          customer_id: customer_id,
          customer_service_id:
            saveNewServiceCustomer.customerServiceId.toString(),
        },
      };
    }
  }
}
