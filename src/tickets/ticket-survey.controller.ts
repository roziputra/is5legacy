import {
  Controller,
  UseGuards,
  Get,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TtsService } from './tickets.service';
import { Request } from 'express';
import { GetListTicketSurveyDto } from './dto/get-list-ticket-survey.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Ticket } from './entities/ticket.entity';

@UseGuards(AuthGuard('api-key'))
@Controller('tickets')
export class TicketSurveyController {
  constructor(private readonly ticketService: TtsService) {}

  @Get('survey')
  async index(
    @Req() req: Request,
    @Query() getListTtsSurveyDto: GetListTicketSurveyDto,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Ticket>> {
    limit = limit > 10 ? 10 : limit;
    return await this.ticketService.getListTicketSurveyServices(
      {
        page,
        limit,
        route: `${req.protocol}://${req.get('Host')}${req.originalUrl}`,
      },
      getListTtsSurveyDto,
    );
  }
}
