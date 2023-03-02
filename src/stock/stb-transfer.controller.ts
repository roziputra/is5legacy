import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/employees/current-user.decorator';
import { Is5LegacyResponseInterceptor } from 'src/interceptors/is5-legacy-response.interceptor';
import { StbTransferService } from './stb-transfer.service';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stocks/stbs/pindah')
export class StbTransferController {
  constructor(private readonly stbTransferService: StbTransferService) {}

  @Put(':id/confirm')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    new Is5LegacyResponseInterceptor('Berhasil konfirmasi permintaan pindah'),
  )
  confirm(@Param('id') id: number, @CurrentUser() user): Promise<any> {
    return this.stbTransferService.confirm(id, user);
  }

  @Put(':id/reject')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    new Is5LegacyResponseInterceptor('Berhasil tolak permintaan pindah'),
  )
  reject(@Param('id') id: number, @CurrentUser() user): Promise<any> {
    return this.stbTransferService.reject(id, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    new Is5LegacyResponseInterceptor('Berhasil hapus permintaan pindah'),
  )
  async remove(@Param('id') id: number, @CurrentUser() user): Promise<any> {
    await this.stbTransferService.remove(id, user);
    return {};
  }
}
