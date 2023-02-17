import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StbEngineerService } from './stb-engineer.service';
import { CreateStbEngineerDto } from './dto/create-stb-engineer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  RequestType,
  Status,
  StbEngineer,
} from './entities/stb-engineer.entity';
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
    @CurrentUser() user,
  ): Promise<any> {
    await this.stbEngineerService.create(createStbEngineerDto, user);
    return {
      title: 'Success',
      message: 'STB created successfully',
    };
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
    };
  }

  @Get(':stbEngineerId')
  @HttpCode(HttpStatus.OK)
  async show(
    @Param('stbEngineerId') stbEngineerId: number,
  ): Promise<StbEngineer> {
    return this.stbEngineerService.findStbEngineer(stbEngineerId);
  }

  @Get(':stbEngineerId/details')
  @HttpCode(HttpStatus.OK)
  async getInventoryByStbId(
    @Param('stbEngineerId') stbEngineerId: number,
  ): Promise<any> {
    const details = await this.stbEngineerService.getInventoryByStbId(
      stbEngineerId,
    );
    return {
      data: details,
    };
  }

  @Delete(':stbEngineerId')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('stbEngineerId') stbEngineerId: number): Promise<any> {
    await this.stbEngineerService.remove(stbEngineerId);
    return {
      title: 'Success',
      message: 'STB delete successfully',
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllStbEnginer(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit,
    @Query('request_type') requestType: RequestType,
    @Query('status') status: Status,
  ) {
    return this.stbEngineerService.findAllStbEnginer(
      {
        page: page,
        limit: limit,
      },
      requestType,
      status,
    );
  }
}
