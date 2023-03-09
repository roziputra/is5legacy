import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StbEngineerService } from './stb-engineer.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stocks/stbs/:id/details')
export class StbEngineerDetailController {
  constructor(private readonly stbEngineerService: StbEngineerService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async getInventoryByStbId(@Param('id') id: number): Promise<any> {
    const details = await this.stbEngineerService.findAllStbDetails(id);
    return {
      data: details,
    };
  }
}
