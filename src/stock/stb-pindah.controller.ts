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
import { StbPindahService } from './stb-pindah.service';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stocks/stbs/pindah')
export class StbPindahController {
  constructor(private readonly stbPindahService: StbPindahService) {}

  @Put(':id/confirm')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    new Is5LegacyResponseInterceptor('Berhasil konfirmasi permintaan pindah'),
  )
  confirm(@Param('id') id: number, @CurrentUser() user): Promise<any> {
    return this.stbPindahService.confirm(id, user);
  }

  @Put(':id/reject')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    new Is5LegacyResponseInterceptor('Berhasil tolak permintaan pindah'),
  )
  reject(@Param('id') id: number, @CurrentUser() user): Promise<any> {
    return this.stbPindahService.reject(id, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    new Is5LegacyResponseInterceptor('Berhasil hapus permintaan pindah'),
  )
  async remove(@Param('id') id: number, @CurrentUser() user): Promise<any> {
    await this.stbPindahService.remove(id, user);
    return {};
  }
}
