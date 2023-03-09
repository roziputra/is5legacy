import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TtsService } from 'src/tickets/tickets.service';
import { FilterTicketDto } from './dto/filter-ticket.dto';
import { CurrentUser } from 'src/employees/current-user.decorator';
import { Employee } from 'src/employees/employee.entity';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/tickets/')
export class TicketController {
  constructor(private readonly ticketService: TtsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllEngineerTickets(
    @Query() filterTicketDto: FilterTicketDto,
    @CurrentUser() user: Employee,
  ): Promise<any> {
    const data = await this.ticketService.findAllEngineerTickets(
      filterTicketDto,
      user,
    );
    return {
      data: data,
    };
  }
}
