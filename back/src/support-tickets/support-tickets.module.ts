import { Module } from '@nestjs/common';
import { SupportTicketsController } from './support-tickets.controller';
import { SupportTicketsService } from './support-tickets.service';
import { SupportTicketsRepository } from './support-tickets.repository';
import { UsersModule } from 'src/users/users.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportTickets } from 'src/entities/supportTickets.entity';
import { TicketsMessages } from 'src/entities/ticketMessages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportTickets, TicketsMessages]),
    UsersModule,
    MailerModule,
  ],
  controllers: [SupportTicketsController],
  providers: [SupportTicketsService, SupportTicketsRepository],
})
export class SupportTicketsModule {}
