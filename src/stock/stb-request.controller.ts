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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestType } from './entities/stb-engineer.entity';
import { CurrentUser } from 'src/employees/current-user.decorator';
import { Is5LegacyResponseInterceptor } from 'src/interceptors/is5-legacy-response.interceptor';
import { StbRequestService } from './stb-request.service';
import { CreateStbRequestDto } from './dto/create-stb-request.dto';
import { UpdateStbRequestDto } from './dto/update-stb-request.dto';
import { Employee } from 'src/employees/employee.entity';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stocks/stbs/requests')
export class StbRequestController {
  constructor(private readonly stbRequestService: StbRequestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(
    new Is5LegacyResponseInterceptor('Berhasil simpan permintaan STB'),
  )
  create(
    @Body() createStbRequestDto: CreateStbRequestDto,
    @CurrentUser() user,
  ): Promise<any> {
    return this.stbRequestService.create(createStbRequestDto, user);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    new Is5LegacyResponseInterceptor('Berhasil update permintaan STB'),
  )
  async update(
    @Param('id') id: number,
    @Body() updateStbRequestDto: UpdateStbRequestDto,
    @CurrentUser() user: Employee,
  ): Promise<any> {
    return this.stbRequestService.update(updateStbRequestDto, id, user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  show(@Param('id') id: number, @CurrentUser() user: Employee): Promise<any> {
    return this.stbRequestService.findStbRequest(id, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    new Is5LegacyResponseInterceptor('Berhasil hapus permintaan STB'),
  )
  async remove(
    @Param('id') id: number,
    @CurrentUser() user: Employee,
  ): Promise<any> {
    return this.stbRequestService.remove(id, user);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAllStbEnginer(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit,
    @Query('request_type') requestType: RequestType,
    @Query('status') status: string,
  ) {
    return this.stbRequestService.findAllStbRequest(
      {
        page: page,
        limit: limit,
      },
      requestType,
      status?.split(',').map((i) => i.trim()),
    );
  }
}
