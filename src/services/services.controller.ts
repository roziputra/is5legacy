import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
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
    try {
      const resultAllServices =
        await this.servicesService.getAllServicesService(filterServiceDto);
      return {
        data: resultAllServices,
      };
    } catch (error) {
      throw new InternalServerErrorException({
        title: 'Internal Server Error',
        message: 'Failed to load resource. please try again later',
      });
    }
  }

  @Get(':service_id')
  @HttpCode(200)
  async getServicesByID(@Param('service_id') service_id) {
    try {
      const resultServicesByID =
        await this.servicesService.getServicesByIDService(service_id);
      return {
        data: resultServicesByID,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException({
        title: 'Internal Server Error',
        message: 'Failed to load resource. please try again later',
      });
    }
  }
}
