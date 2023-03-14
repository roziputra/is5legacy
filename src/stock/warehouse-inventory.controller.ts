import {
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StbEngineerService } from './stb-engineer.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/employees/current-user.decorator';
import { Employee } from 'src/employees/employee.entity';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stocks/warehouses/inventories')
export class WarehouseInventoryController {
  constructor(private readonly stbEngineerService: StbEngineerService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAllWarehouseInventory(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit,
    @Query('search') search: string,
    @CurrentUser() user: Employee,
  ): Promise<any> {
    return this.stbEngineerService.findAllWarehouseInventories(
      page,
      limit,
      search,
      user,
    );
  }
}
