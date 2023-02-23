import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StbEngineerService } from './stb-engineer.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stocks/engineers/:id/inventories')
export class EngineerInventoryController {
  constructor(private readonly stbEngineerService: StbEngineerService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getEngineerInventory(
    @Param('id') engineerId: string,
    @Query('search') search: string,
  ): Promise<any> {
    const engineerInventories =
      await this.stbEngineerService.findEngineerInventory(engineerId, search);
    return {
      data: engineerInventories,
    };
  }
}
