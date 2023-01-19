import { Module } from '@nestjs/common';
import { TtsModule } from 'src/tickets/tickets.module';

@Module({
  imports: [TtsModule],
})
export class CronModule {}
