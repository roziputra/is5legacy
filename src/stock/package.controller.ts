import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PackageService } from './package.service';
import { StbEngineerService } from './stb-engineer.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class PackageController {
  constructor(
    private readonly packageService: PackageService,
    private readonly stbEngineerService: StbEngineerService,
  ) {}

  /**
   * deprecated use api/v1/stock/packages instead
   */
  @Get('stocks/packages')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async findPackage(): Promise<any> {
    const packages = await this.stbEngineerService.getPackages();
    return {
      data: packages,
    };
  }

  @Get('api/v1/stock/packages')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async findPackages(): Promise<any> {
    return await this.packageService.findPackages();
  }
}
