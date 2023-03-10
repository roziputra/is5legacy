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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PackageService } from './package.service';
import { CurrentUser } from 'src/employees/current-user.decorator';
import { Employee } from 'src/employees/employee.entity';
import { StbEngineerService } from './stb-engineer.service';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stock/packages/:id/details')
export class PackageDetailController {
  constructor(
    private readonly packageService: PackageService,
    private readonly stbEngineerService: StbEngineerService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async findPackagesDetail(
    @Param('id') id: number,
    @CurrentUser() user: Employee,
  ): Promise<any> {
    const branch = this.stbEngineerService.getMasterBranch(user);
    const packages = await this.packageService.findPackageDetails(id, branch);
    return {
      data: packages,
    };
  }
}
