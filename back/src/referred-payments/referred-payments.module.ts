import { Module } from '@nestjs/common';
import { ReferredPaymentsController } from './referred-payments.controller';
import { ReferredPaymentsService } from './referred-payments.service';
import { ReferredPaymentsRepository } from './referred-payments.repository';

@Module({
  controllers: [ReferredPaymentsController],
  providers: [ReferredPaymentsService, ReferredPaymentsRepository],
})
export class ReferredPaymentsModule {}
