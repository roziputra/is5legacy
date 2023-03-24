import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PackageService } from './package.service';
import { CurrentUser } from 'src/employees/current-user.decorator';
import { Employee } from 'src/employees/employee.entity';
import { StbEngineerService } from './stb-engineer.service';
import { Is5LegacyApiResourceInterceptor } from 'src/interceptors/is5-legacy-api-resource.interceptor';
import { RequestStbPackageDetailApiResource } from './resources/request-stb-package-detail-api-resource';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stock/packages/:id/details')
export class PackageDetailController {
  constructor(
    private readonly packageService: PackageService,
    private readonly stbEngineerService: StbEngineerService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    new Is5LegacyApiResourceInterceptor(
      RequestStbPackageDetailApiResource,
      'data',
    ),
  )
  async findPackagesDetail(
    @Param('id') id: number,
    @CurrentUser() user: Employee,
  ): Promise<any> {
    const branch = this.stbEngineerService.getMasterBranch(user);
    return await this.packageService.findPackageDetails(id, branch);
  }
}
