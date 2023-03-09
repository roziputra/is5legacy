import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CustomersService } from './customers.service';
import { CreateNewCustomerDto } from './dtos/create-customer.dto';
import { CreateNewServiceCustomersDto } from './dtos/create-service-customer.dto';
import { GetCustomerListDto } from './dtos/get-customer-list.dto';
import { GetCustomerSalutationDto } from './dtos/get-customer-salutation.dto';

@UseGuards(AuthGuard('api-key'))
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('salutations')
  async getListSalutation(
    @Query() getCustomerSalutationDto: GetCustomerSalutationDto,
  ): Promise<any> {
    const resultOfSalutations =
      await this.customersService.getListSalutationService(
        getCustomerSalutationDto,
      );

    return {
      data: resultOfSalutations,
    };
  }

  @Get()
  @HttpCode(200)
  async getCustomerDetail(
    @Query() getCustomerListDto: GetCustomerListDto,
  ): Promise<any> {
    const resultAllCustomers = await this.customersService.getCustomerServices(
      getCustomerListDto,
    );

    return {
      data: resultAllCustomers,
    };
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
