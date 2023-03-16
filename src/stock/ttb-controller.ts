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
  UploadedFiles,
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
import { Is5LegacyApiResourceInterceptor } from 'src/interceptors/is5-legacy-api-resource.interceptor';
import { TtbApiResource } from './resources/ttb-api-resource';
import { FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stock/ttb')
export class TtbController {
  constructor(private readonly ttbCustomerService: TtbCustomerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('files'))
  @UseInterceptors(new Is5LegacyResponseInterceptor('Berhasil simpan TTB'))
  async create(
    @Body() createTtbCustomerDto: CreateTtbCustomerDto,
    @CurrentUser() user: Employee,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    return this.ttbCustomerService.create(createTtbCustomerDto, files, user);
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
  @UseInterceptors(new Is5LegacyApiResourceInterceptor(TtbApiResource))
  show(@Param('id') id: number): Promise<TtbCustomer> {
    return this.ttbCustomerService.findOneTtb(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new Is5LegacyResponseInterceptor('Berhasil hapus TTB'))
  async remove(@Param('id') id: number): Promise<any> {
    return await this.ttbCustomerService.remove(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new Is5LegacyApiResourceInterceptor(TtbApiResource))
  findAllTtb() {
    return this.ttbCustomerService.findAllTtb();
  }
}
