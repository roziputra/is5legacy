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
    @CurrentUser() user,
  ): Promise<any> {
    return this.stbTransferService.confirm(
      id,
      confirmStbTransferDto.status,
      user,
    );
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit,
    @Query('transfer_type') transferType: TransferType,
    @Query('status') status: Status,
    @CurrentUser() user: Employee,
  ) {
    const statusArray = status.split(',').map((i) => i.trim());
    const transferTypeArray = transferType.split(',').map((i) => i.trim());
    return this.stbTransferService.findAll(
      user.EmpId,
      transferTypeArray,
      statusArray,
      { page: page, limit: limit },
    );
  }

  @Get('total-permintaan')
  @HttpCode(HttpStatus.OK)
  getTotalPermintaan(@CurrentUser() user: Employee): Promise<any> {
    return this.stbTransferService.getTotalPermintaan(user.EmpId);
  }
}
