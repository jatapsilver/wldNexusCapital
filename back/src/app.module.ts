import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, DataLoaderPackages, DataLoaderUsers } from './app.service';
import { UsersModule } from './users/users.module';
import { CredentialsModule } from './credentials/credentials.module';
import { PackagesModule } from './packages/packages.module';
import { PurchaseOrderModule } from './purchase-order/purchase-order.module';
import { ReferredPaymentsModule } from './referred-payments/referred-payments.module';
import { ProgressPackagesModule } from './progress-packages/progress-packages.module';
import { TransactionHistoryModule } from './transaction-history/transaction-history.module';
import { SupportHistoryModule } from './support-history/support-history.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { WithdrawalsHistoryModule } from './withdrawals-history/withdrawals-history.module';
import { SupportTicketsModule } from './support-tickets/support-tickets.module';
import { DepositHistoryModule } from './deposit-history/deposit-history.module';
import * as path from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { DailyReturnModule } from './daily-return/daily-return.module';
import { DispersionUsdtModule } from './dispersion-usdt/dispersion-usdt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => config.get('typeorm'),
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    CredentialsModule,
    PackagesModule,
    PurchaseOrderModule,
    ReferredPaymentsModule,
    ProgressPackagesModule,
    TransactionHistoryModule,
    SupportHistoryModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '4h' },
    }),
    AuthModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          secure: false,
          auth: {
            user: config.get<string>('EMAIL_USER'),
            pass: config.get<string>('EMAIL_PASS'),
          },
        },
        defaults: {
          from: `"NeuroBotIA Team" <${config.get<string>('EMAIL_USER')}>`,
        },
        template: {
          dir: path.join(__dirname, 'mailer/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    WithdrawalsHistoryModule,
    SupportTicketsModule,
    DepositHistoryModule,
    DailyReturnModule,
    DispersionUsdtModule,
  ],
  controllers: [AppController],
  providers: [AppService, DataLoaderPackages, DataLoaderUsers],
})
export class AppModule {}
