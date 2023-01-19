import { Module } from '@nestjs/common';
import { TtsModule } from 'src/tickets/tickets.module';
import { FinanceModule } from 'src/finance/finance.module';
import { CronService } from './cron.service';
import { GeneralTicketExpiredDocService } from './general-ticket-expired-doc.service';
import { DepreciationJournalService } from './depreciation-journal.service';

@Module({
  imports: [TtsModule, FinanceModule],
  providers: [
    CronService,
    GeneralTicketExpiredDocService,
    DepreciationJournalService,
  ],
})
export class CronModule {}
