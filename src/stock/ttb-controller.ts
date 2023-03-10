import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/employees/current-user.decorator';
import { Is5LegacyResponseInterceptor } from 'src/interceptors/is5-legacy-response.interceptor';
import { TtbCustomerService } from './ttb-customer.service';
import { CreateTtbCustomerDto } from './dto/create-ttb-customer.dto';
import { Employee } from 'src/employees/employee.entity';
import { UpdateTtbCustomerDto } from './dto/update-ttb-customer.dto';
import { TtbCustomer } from './entities/ttb-customer.entity';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stock/ttb')
export class TtbController {
  constructor(private readonly ttbCustomerService: TtbCustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(new Is5LegacyResponseInterceptor('Berhasil simpan TTB'))
  create(
    @Body() createTtbCustomerDto: CreateTtbCustomerDto,
    @CurrentUser() user: Employee,
  ): Promise<any> {
    return this.ttbCustomerService.create(createTtbCustomerDto, user);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new Is5LegacyResponseInterceptor('Berhasil update TTB'))
  update(
    @Param('id') id: number,
    @Body() updateTtbCustomerDto: UpdateTtbCustomerDto,
  ): Promise<any> {
    return this.ttbCustomerService.update(updateTtbCustomerDto, id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  show(@Param('id') id: number): Promise<TtbCustomer> {
    return this.ttbCustomerService.find(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new Is5LegacyResponseInterceptor('Berhasil hapus TTB'))
  async remove(@Param('id') id: number): Promise<any> {
    return await this.ttbCustomerService.remove(id);
  }
}
