import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MailerModule } from '../mailer/mailer.module';
import { PasswordResetToken } from 'src/entities/passwordReset.entity';
import { TransactionHistoryModule } from 'src/transaction-history/transaction-history.module';
import { ProgressPackagesModule } from 'src/progress-packages/progress-packages.module';
import { WithdrawalsHistoryModule } from 'src/withdrawals-history/withdrawals-history.module';
import { Credential } from 'src/entities/credential.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordResetToken, Credential]),
    MailerModule,
    TransactionHistoryModule,
    ProgressPackagesModule,
    WithdrawalsHistoryModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository, TypeOrmModule],
})
export class UsersModule {}
