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
import { CurrentUser } from 'src/employees/current-user.decorator';
import { Employee } from 'src/employees/employee.entity';
import { Is5LegacyApiResourceInterceptor } from 'src/interceptors/is5-legacy-api-resource.interceptor';
import { RequestStbPackageApiResource } from './resources/request-stb-package-api-resource';

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
  @UseInterceptors(
    new Is5LegacyApiResourceInterceptor(RequestStbPackageApiResource, 'data'),
  )
  findPackages(@CurrentUser() user: Employee): Promise<any> {
    return this.packageService.findPackages(user);
  }
}
