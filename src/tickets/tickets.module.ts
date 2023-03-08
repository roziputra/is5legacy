import { Module } from '@nestjs/common';
import { TtsService } from './tickets.service';
import { TtsController } from './tickets.controller';
import { Tts } from './tickets.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from 'src/employees/employees.module';
import { GeneralTicketRepository } from './repositories/general-ticket-repository';
import { IsoDocumentRepository } from './repositories/iso-document-repository';
import { TicketPicRepository } from './repositories/ticket-pic.repository';
import { GeneralTicketPicRepository } from './repositories/general-ticket-pic.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Tts]), EmployeesModule],
  providers: [
    TtsService,
    GeneralTicketRepository,
    IsoDocumentRepository,
    TicketPicRepository,
    GeneralTicketPicRepository,
  ],
  controllers: [TtsController],
  exports: [TtsService],
})
export class TtsModule {}
