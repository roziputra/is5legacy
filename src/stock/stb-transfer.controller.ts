import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/employees/current-user.decorator';
import { Is5LegacyResponseInterceptor } from 'src/interceptors/is5-legacy-response.interceptor';
import { StbTransferService } from './stb-transfer.service';

import { ConfirmStbTransferDto } from './dto/confirm-stb-transfer.dto';
import { StbTransferApiResourceInterceptor } from './resources/stb-transfer-api-resource.interceptor';

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
}
