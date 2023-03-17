import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/employees/current-user.decorator';
import { Is5LegacyResponseInterceptor } from 'src/interceptors/is5-legacy-response.interceptor';
import { StbTransferService } from './stb-transfer.service';

import { ConfirmStbTransferDto } from './dto/confirm-stb-transfer.dto';
import { StbTransferApiResourceInterceptor } from './resources/stb-transfer-api-resource.interceptor';
import { Employee } from 'src/employees/employee.entity';
import { TransferType } from './entities/stb-engineer.entity';
import { Status } from './entities/stb-request.entity';
import { FilterPaginationDto } from './dto/filter-pagination.dto';
import { FilterStbTransferDto } from './dto/filter-stb-transfer.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stocks/stbs/transfer')
export class StbTransferController {
  constructor(private readonly stbTransferService: StbTransferService) {}

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    new Is5LegacyResponseInterceptor('Berhasil konfirmasi permintaan pindah'),
  )
  confirm(
    @Param('id') id: number,
    @Body() confirmStbTransferDto: ConfirmStbTransferDto,
    @CurrentUser() user: Employee,
  ): Promise<any> {
    return this.stbTransferService.confirm(
      id,
      confirmStbTransferDto.status,
      user,
    );
  }

  @Get('total')
  @HttpCode(HttpStatus.OK)
  getTotalPermintaan(@CurrentUser() user: Employee): Promise<any> {
    return this.stbTransferService.getTotalPermintaan(user.EmpId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(StbTransferApiResourceInterceptor)
  async show(@Param('id') id: number) {
    return this.stbTransferService.findOne(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(
    @Query() filterPaginationDto: FilterPaginationDto,
    @Query() filterStbTransferDto: FilterStbTransferDto,
    @CurrentUser() user: Employee,
  ) {
    const { page, limit } = filterPaginationDto;
    const { status, transferType } = filterStbTransferDto;

    return this.stbTransferService.findAll(user.EmpId, transferType, status, {
      page: page,
      limit: limit,
    });
  }
}
