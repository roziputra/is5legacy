import { Module } from '@nestjs/common';
import { TtsService } from './tickets.service';
// import { TtsController } from './tickets.controller';
import { Tts } from './tickets.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from 'src/employees/employees.module';
import { GeneralTicketRepository } from './repositories/general-ticket-repository';
import { IsoDocumentRepository } from './repositories/iso-document-repository';
import { TicketPicRepository } from './repositories/ticket-pic.repository';
import { GeneralTicketPicRepository } from './repositories/general-ticket-pic.repository';
import { TicketController } from './ticket.controller';
import { Ticket } from './entities/ticket.entity';
import { TicketRepository } from './repositories/ticket.repository';
import { TicketsController } from './client/ticket.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tts, Ticket]), EmployeesModule],
  providers: [
    TtsService,
    GeneralTicketRepository,
    IsoDocumentRepository,
    TicketPicRepository,
    GeneralTicketPicRepository,
    TicketRepository,
  ],
  controllers: [TicketController, TicketsController],
  exports: [TtsService],
})
export class TtsModule {}
