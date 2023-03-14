import {
  Query,
  Controller,
  Get,
  UseGuards,
  Req,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TtsService } from './tickets.service';
import { Request } from 'express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Ticket } from './entities/ticket.entity';
import { GetListTicketSurveyDto } from './dto/get-list-ticket-survey.dto';

@UseGuards(AuthGuard('api-key'))
@Controller('tts')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Get('/')
  getResultReport(
    @Query('periodStart') periodStart: string,
    @Query('periodEnd') periodEnd: string,
  ) {
    return this.ttsService.resultReport(periodStart, periodEnd);
  }

  @Get('/incident')
  getTts(
    @Query('periodStart') periodStart: string,
    @Query('periodEnd') periodEnd: string,
  ) {
    return this.ttsService.getTtsIncident(periodStart, periodEnd);
  }

  @Get('/assign')
  getTtsAssign(
    @Query('periodStart') periodStart: string,
    @Query('periodEnd') periodEnd: string,
  ) {
    return this.ttsService.getTtsAssign(periodStart, periodEnd);
  }

  @Get('/reopen')
  getTtsReopen(
    @Query('periodStart') periodStart: string,
    @Query('periodEnd') periodEnd: string,
  ) {
    return this.ttsService.getTtsReopen(periodStart, periodEnd);
  }

  @Get('/solve')
  getTtsSolve(
    @Query('periodStart') periodStart: string,
    @Query('periodEnd') periodEnd: string,
  ) {
    return this.ttsService.getTtsSolve(periodStart, periodEnd);
  }

  @Get('survey')
  async getListTicketSurvey(
    @Req() req: Request,
    @Query() getListTtsSurveyDto: GetListTicketSurveyDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Ticket>> {
    limit = limit > 10 ? 10 : limit;
    return await this.ttsService.getListTicketSurveyServices(
      {
        page,
        limit,
        route: `${req.protocol}://${req.get('Host')}${req.originalUrl}`,
      },
      getListTtsSurveyDto,
    );
  }
}
