import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StbEngineerService } from './stb-engineer.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('stocks/warehouses/inventories')
export class WarehouseInventoryController {
  constructor(private readonly stbEngineerService: StbEngineerService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllWarehouseInventory(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit,
    @Query('search') search: string,
  ): Promise<any> {
    return this.stbEngineerService.findAllWarehouseInventory(
      {
        page: page,
        limit: limit,
      },
      search,
    );
  }
}
