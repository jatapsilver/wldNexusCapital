import { Module } from '@nestjs/common';
import { DispersionUsdtController } from './dispersion-usdt.controller';
import { DispersionUsdtService } from './dispersion-usdt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepositHistory } from 'src/entities/depositHistory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DepositHistory])],
  controllers: [DispersionUsdtController],
  providers: [DispersionUsdtService],
})
export class DispersionUsdtModule {}
