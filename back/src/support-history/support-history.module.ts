import { Module } from '@nestjs/common';
import { SupportHistoryController } from './support-history.controller';
import { SupportHistoryService } from './support-history.service';
import { SupportHistoryRepository } from './support-history.repository';

@Module({
  controllers: [SupportHistoryController],
  providers: [SupportHistoryService, SupportHistoryRepository],
})
export class SupportHistoryModule {}
