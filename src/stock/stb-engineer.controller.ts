import {
  Body,
  ClassSerializerInterceptor,
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
  UseInterceptors,
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
import { Is5LegacyResponseInterceptor } from 'src/interceptors/is5-legacy-response.interceptor';

@UseGuards(JwtAuthGuard)
@Controller('stocks/stb-engineers')
export class StbEngineerController {
  constructor(private readonly stbEngineerService: StbEngineerService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(new Is5LegacyResponseInterceptor('Berhasil simpan STB'))
  create(
    @Body() createStbEngineerDto: CreateStbEngineerDto,
    @CurrentUser() user,
  ): Promise<any> {
    return this.stbEngineerService.create(createStbEngineerDto, user);
  }

  @Put(':stbEngineerId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new Is5LegacyResponseInterceptor('Berhasil update STB'))
  update(
    @Param('stbEngineerId') stbEngineerId: number,
    @Body() updateStbEngineerDto: UpdateStbEngineerDto,
  ): Promise<any> {
    return this.stbEngineerService.update(updateStbEngineerDto, stbEngineerId);
  }

  @Get(':stbEngineerId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  show(@Param('stbEngineerId') stbEngineerId: number): Promise<StbEngineer> {
    return this.stbEngineerService.findStbEngineer(stbEngineerId);
  }

  @Get(':stbEngineerId/details')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
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
  @UseInterceptors(new Is5LegacyResponseInterceptor('Berhasil hapus STB'))
  async remove(@Param('stbEngineerId') stbEngineerId: number): Promise<any> {
    await this.stbEngineerService.remove(stbEngineerId);
    return {};
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
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
