import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StbEngineerService } from './stb-engineer.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilterEngineerInventoryDto } from './dto/filter-engineer-inventory.dto';

@UseGuards(JwtAuthGuard)
@Controller('stocks/engineer-inventories')
export class EngineerInventoryController {
  constructor(private readonly stbEngineerService: StbEngineerService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getEngineerInventory(
    @Query() filterEngineerInventoryDto: FilterEngineerInventoryDto,
  ): Promise<any> {
    const engineerInventories =
      await this.stbEngineerService.findEngineerInventory(
        filterEngineerInventoryDto,
      );
    return {
      data: engineerInventories,
    };
  }
}
