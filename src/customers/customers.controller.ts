import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
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
import { GetOperatorSubscriptionDto } from './dto/get-operator-subscription.dto';
import { CreateNewCustomerDto } from './dto/create-customer.dto';
import { DataSource } from 'typeorm';
import { CreateNewServiceCustomersDto } from './dto/create-service-customer.dto';

@UseGuards(AuthGuard('api-key'))
@Controller('customers')
export class CustomersController {
  constructor(
    private dataSource: DataSource,
    private readonly customersService: CustomersService,
  ) {}

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
  async getCustomerDetail(@Param('customer_id') customerId) {
    try {
      const resultAllCustomers =
        await this.customersService.getCustomerServices(customerId);
      return {
        data: resultAllCustomers,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        title: 'Internal Server Error',
        message: 'Failed to load resource. please try again later',
      });
    }
  }

  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  async saveNewCustomer(@Body() createNewCustomerDto: CreateNewCustomerDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const saveNewCustomers =
        await this.customersService.saveNewCustomerServices(
          createNewCustomerDto,
        );
      await queryRunner.manager.save(saveNewCustomers.data_pelanggan);
      await queryRunner.manager.save(saveNewCustomers.data_phonebook_1);
      if (
        saveNewCustomers.data_phonebook_1.phone !=
        saveNewCustomers.data_phonebook_2.phone
      ) {
        await queryRunner.manager.save(saveNewCustomers.data_phonebook_2);
      }
      await queryRunner.manager.save(saveNewCustomers.data_layanan);
      await queryRunner.manager.save(saveNewCustomers.data_npwp);
      await queryRunner.manager.query(`UPDATE CustomerTemp SET Taken = 1
      WHERE CustId = '${saveNewCustomers.data_layanan.CustId}'`);

      await queryRunner.commitTransaction();
      return {
        title: 'Success',
        message: 'Success to save resource',
        data: saveNewCustomers.data_layanan.CustId,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException({
        title: 'Conflict',
        message: 'Failed to save resource. please try again later',
      });
    }
  }

  @Post(':customer_id/services')
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  async saveDataCustServices(
    @Param('customer_id') customer_id,
    @Body() createNewServiceCustomersDto: CreateNewServiceCustomersDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const saveNewCustomerServices =
        await this.customersService.saveDataCustomerServLogic(
          createNewServiceCustomersDto,
          customer_id,
        );
      await queryRunner.manager.save(saveNewCustomerServices.data_layanan);
      await queryRunner.commitTransaction();

      return {
        title: 'Success',
        message: 'Success to save resource',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ConflictException({
        title: 'Conflict',
        message: 'Failed to save resource. please try again later',
      });
    }
  }
}
