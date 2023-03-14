import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StbEngineerService } from './stb-engineer.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/employees/current-user.decorator';
import { Employee } from 'src/employees/employee.entity';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stocks/engineers/')
export class EngineerInventoryController {
  constructor(private readonly stbEngineerService: StbEngineerService) {}

  @Get(':id/inventories')
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

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async index(@CurrentUser() user: Employee): Promise<any> {
    const branch = this.stbEngineerService.getMasterBranch(user);
    const engineers = await this.stbEngineerService.findAllEngineer(branch);
    return {
      data: engineers,
    };
  }
}
