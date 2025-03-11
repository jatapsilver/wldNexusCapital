import { Module } from '@nestjs/common';
import { DepositHistoryController } from './deposit-history.controller';
import { DepositHistoryService } from './deposit-history.service';
import { DepositHistoryRepository } from './deposit-history.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositHistory } from 'src/entities/depositHistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DepositHistory])],
  controllers: [DepositHistoryController],
  providers: [DepositHistoryService, DepositHistoryRepository],
  exports: [DepositHistoryRepository],
})
export class DepositHistoryModule {}
