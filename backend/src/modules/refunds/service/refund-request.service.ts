import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  AiClassification,
  RefundDecision,
  RefundListOptions,
} from '../../../utility/interface';
import { PolicyEngine, PolicyOutcome } from '../../../policy/policy.engine';
import { IRefundRequestRepository } from '../IRefundRepository/interface';
import { OrderService } from '../../orders/service/order.service';
import { AiService } from '../../../ai/ai.service';
import { RefundRequestEntity } from '../entity/refund.entity';

export interface ProcessRefundInput {
  orderNumber: string;
  customerMessage: string;
}

export interface ProcessRefundResult {
  decision: RefundDecision;
  reason: string;
  customerResponse: string;
  requestId: string;
  classification: AiClassification | null;
  policyEvaluation: PolicyOutcome;
}

@Injectable()
export class RefundsService {
  constructor(
    @Inject('IRefundRequestRepository')
    private readonly refunds: IRefundRequestRepository,
    private readonly orders: OrderService,
    private readonly ai: AiService,
    private readonly policy: PolicyEngine,
  ) {}

  async process(input: ProcessRefundInput): Promise<ProcessRefundResult> {
    // 1. Load order
    const order = await this.orders.findOrder({
      order_number: input.orderNumber,
    });
    if (!order) {
      throw new NotFoundException(`Order ${input.orderNumber} not found`);
    }

    // 2. AI classifies the message (structured output, untrusted input)
    const classification = await this.ai.classify(input.customerMessage);

    // 3. Policy engine decides (deterministic, authoritative)
    const policyEvaluation = this.policy.evaluate(order, classification);

    // 4. AI drafts the customer-facing response based on the decision
    const customerResponse = await this.ai.draftResponse(
      policyEvaluation.decision,
      { order_number: order.order_number, amount: order.amount },
      policyEvaluation.primary_reason,
    );

    // 5. Persist the audit record
    const saved = await this.refunds.create({
      orderId: order.id,
      customer_message: input.customerMessage,
      ai_classification: classification,
      policy_evaluation: policyEvaluation,
      decision: policyEvaluation.decision,
      decision_reason: policyEvaluation.primary_reason,
      customer_response: customerResponse,
      had_injection_attempt: classification.flags.includes('injection_attempt'),
    });

    return {
      decision: saved.decision,
      reason: saved.decision_reason ?? policyEvaluation.primary_reason,
      customerResponse: saved.customer_response ?? customerResponse,
      requestId: saved.id,
      classification,
      policyEvaluation,
    };
  }

  list(options: RefundListOptions) {
    return this.refunds.findRecent(options);
  }

  async getById(id: string): Promise<RefundRequestEntity> {
    const request = await this.refunds.findById(id);
    if (!request) throw new NotFoundException(`Refund request ${id} not found`);
    return request;
  }
}
