import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefundRequestEntity } from './entity/refund.entity';
import { RefundsController } from './controller/refund.controller';
import { RefundsService } from './service/refund-request.service';
import { RefundRequestRepository } from './repository/refund.repository';
import { OrderModule } from '../orders/order.module';
import { AiService } from '../../ai/ai.service';
import { PolicyEngine } from '../../policy/policy.engine';

@Module({
  imports: [TypeOrmModule.forFeature([RefundRequestEntity]), OrderModule],
  providers: [
    RefundsService,
    AiService,
    PolicyEngine,
    {
      provide: 'IRefundRequestRepository',
      useClass: RefundRequestRepository,
    },
  ],
  controllers: [RefundsController],
  exports: [],
})
export class RefundModule {}
