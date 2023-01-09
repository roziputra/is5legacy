import { Module } from '@nestjs/common';
import { CronController } from './cron.controller';
import { GeneralTicketExpiredDocService } from './general-ticket-expired-doc.service';
import { TtsModule } from 'src/tickets/tickets.module';

@Module({
  imports: [TtsModule],
  controllers: [CronController],
  providers: [GeneralTicketExpiredDocService],
})
export class CronModule {}
