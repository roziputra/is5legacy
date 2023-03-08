import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/employees/current-user.decorator';
import { Employee } from 'src/employees/employee.entity';
import { TtsService } from 'src/tickets/tickets.service';

@UseGuards(JwtAuthGuard)
@Controller('api/v1/stocks/engineers/')
export class EngineerTicketController {
  constructor(private readonly ticketService: TtsService) {}

  @Get(':id/tickets')
  @HttpCode(HttpStatus.OK)
  async findAllEngineerTickets(@Param('id') engineer: string): Promise<any> {
    const data = await this.ticketService.findAllEngineerTickets(engineer);
    return {
      data: data,
    };
  }
}
