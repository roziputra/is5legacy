import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StbEngineerService } from './stb-engineer.service';
import { CreateStbEngineerDto } from './dto/create-stb-engineer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StbEngineer } from './entities/stb-engineer.entity';
import { UpdateStbEngineerDto } from './dto/update-stb-engineer.dto';
import { CurrentUser } from 'src/employees/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('stocks/stb-engineers')
export class StbEngineerController {
  constructor(private readonly stbEngineerService: StbEngineerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createStbEngineerDto: CreateStbEngineerDto,
    @CurrentUser() user
  ): Promise<any> {
    const userId = user.user;
    await this.stbEngineerService.create(createStbEngineerDto, userId);
    return {
        title: 'Success',
        message: 'STB created successfully',
    }
  }

  @Put(':stbEngineerId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('stbEngineerId') stbEngineerId: number,
    @Body() updateStbEngineerDto: UpdateStbEngineerDto,
  ): Promise<any> {
    await this.stbEngineerService.update(updateStbEngineerDto, stbEngineerId);
    return {
        title: 'Success',
        message: 'STB updated successfully',
    }
  }

  @Get(':stbEngineerId')
  @HttpCode(HttpStatus.OK)
  async show(
    @Param('stbEngineerId') stbEngineerId: number,
    @Req() request: Request
  ): Promise<StbEngineer> {
    const userId = request['user'].user;
    return await this.stbEngineerService.findStbEngineer(stbEngineerId);
  }

  @Delete(':stbEngineerId')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('stbEngineerId') stbEngineerId: number,
  ): Promise<any> {
    await this.stbEngineerService.remove(stbEngineerId);
    return {
      title: 'Success',
      message: 'STB delete successfully',
    }
  }
}