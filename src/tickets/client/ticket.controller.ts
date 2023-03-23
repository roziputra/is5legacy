import {
  Controller,
  UseGuards,
  Get,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Put,
  Param,
  Body,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TtsService } from '../tickets.service';
import { Request } from 'express';
import { GetListTicketSurveyDto } from '../dto/get-list-ticket-survey.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Ticket } from '../entities/ticket.entity';
import { UpdateSurveyTicketDto } from '../dto/update-ticket.dto';
import { HttpStatus } from '@nestjs/common';
import { Is5LegacyApiResourceInterceptor } from 'src/interceptors/is5-legacy-api-resource.interceptor';
import { TicketSurveyApiResource } from '../resources/ticket-survey-api-resource';
import { Is5LegacyResponseInterceptor } from 'src/interceptors/is5-legacy-response.interceptor';

@UseGuards(AuthGuard('api-key'))
@Controller('client/tts')
export class TicketsController {
  constructor(private readonly ticketService: TtsService) {}

  @Get()
  @UseInterceptors(new Is5LegacyApiResourceInterceptor(TicketSurveyApiResource))
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

  @Put(':ticket_id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    new Is5LegacyResponseInterceptor('Berhasil mengupdate ticket survey'),
  )
  async update(
    @Param('ticket_id') ticketId: number,
    @Body() updateSurveyTicketDto: UpdateSurveyTicketDto,
  ): Promise<any> {
    return await this.ticketService.updateTicketSurvey(
      ticketId,
      updateSurveyTicketDto,
    );
  }
}
