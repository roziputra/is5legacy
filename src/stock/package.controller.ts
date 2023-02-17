import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { StbEngineerService } from './stb-engineer.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('stocks/stb-engineers/packages')
export class PackageController {
  constructor(private readonly stbEngineerService: StbEngineerService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPackages(): Promise<any> {
    const packages = await this.stbEngineerService.getPackages();
    return {
      data: packages,
    };
  }
}
