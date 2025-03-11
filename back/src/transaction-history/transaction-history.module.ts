import { forwardRef, Module } from '@nestjs/common';
import { TransactionHistoryController } from './transaction-history.controller';
import { TransactionHistoryService } from './transaction-history.service';
import { TransactionHistoryRepository } from './transaction-history.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionHistory } from 'src/entities/transactionHistory.entity';
import { UsersModule } from 'src/users/users.module';

import { WithdrawalsHistoryModule } from 'src/withdrawals-history/withdrawals-history.module';
import { ProgressPackagesModule } from 'src/progress-packages/progress-packages.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionHistory]),
    forwardRef(() => UsersModule),
    forwardRef(() => WithdrawalsHistoryModule),
    forwardRef(() => ProgressPackagesModule),
  ],
  controllers: [TransactionHistoryController],
  providers: [TransactionHistoryService, TransactionHistoryRepository],
  exports: [TransactionHistoryRepository],
})
export class TransactionHistoryModule {}
