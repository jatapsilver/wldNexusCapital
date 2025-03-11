import { Module } from '@nestjs/common';
import { WithdrawalsHistoryController } from './withdrawals-history.controller';
import { WithdrawalsHistoryService } from './withdrawals-history.service';
import { WithdrawalsHistoryRepository } from './withdrawals-history.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawalsHistory } from 'src/entities/withdrawalsHistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WithdrawalsHistory])],
  controllers: [WithdrawalsHistoryController],
  providers: [WithdrawalsHistoryService, WithdrawalsHistoryRepository],
  exports: [WithdrawalsHistoryRepository],
})
export class WithdrawalsHistoryModule {}
