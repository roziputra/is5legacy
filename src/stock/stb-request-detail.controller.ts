import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StbRequestService } from './stb-request.service';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stocks/stbs/requests/:id/details')
export class StbRequestDetailController {
  constructor(private readonly stbRequestService: StbRequestService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Param('id') id: number) {
    return this.stbRequestService.findAllRequestDetails(id);
  }
}
