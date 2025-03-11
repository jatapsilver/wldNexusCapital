import { Module } from '@nestjs/common';
import { PurchaseOrderController } from './purchase-order.controller';
import { PurchaseOrderService } from './purchase-order.service';
import { PurchaseOrderRepository } from './purchase-order.repository';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { ProgressPackagesModule } from 'src/progress-packages/progress-packages.module';
import { Package } from 'src/entities/package.entity';
import { DepositHistoryModule } from 'src/deposit-history/deposit-history.module';
import { TransactionHistoryModule } from 'src/transaction-history/transaction-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Package]),
    UsersModule,
    TransactionHistoryModule,
    ProgressPackagesModule,
    DepositHistoryModule,
  ],
  controllers: [PurchaseOrderController],
  providers: [PurchaseOrderService, PurchaseOrderRepository],
})
export class PurchaseOrderModule {}
