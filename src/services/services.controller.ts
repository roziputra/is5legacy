import { Controller, Get, HttpCode, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetServiceFilterDto } from './dto/get-service-filter.dto';
import { ServicesService } from './services.service';

@UseGuards(AuthGuard('api-key'))
@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  @HttpCode(200)
  async getAllServices(@Query() filterServiceDto: GetServiceFilterDto) {
    const resultAllServices = await this.servicesService.getAllServicesService(
      filterServiceDto,
    );

    return {
      data: resultAllServices,
    };
  }
}
