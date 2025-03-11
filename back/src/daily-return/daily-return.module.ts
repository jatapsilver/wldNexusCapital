import { Module } from '@nestjs/common';
import { DailyReturnService } from './daily-return.service';
import { DailyReturnController } from './daily-return.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageProgress } from 'src/entities/packageProgress.entity';
import { TransactionHistory } from 'src/entities/transactionHistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PackageProgress, TransactionHistory])],
  providers: [DailyReturnService],
  controllers: [DailyReturnController],
})
export class DailyReturnModule {}
