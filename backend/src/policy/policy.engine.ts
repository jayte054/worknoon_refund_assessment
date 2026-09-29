import { Injectable } from '@nestjs/common';
import { OrderEntity } from '../modules/orders/entity/order.entity';
import { AiClassification } from '../utility/interface';

export type PolicyDecision = 'approved' | 'denied' | 'escalated';

export interface PolicyRuleResult {
  rule: string;
  passed: boolean;
  detail?: string;
}

export interface PolicyOutcome {
  decision: PolicyDecision;
  primary_reason: string;
  rules_checked: PolicyRuleResult[];
}

export interface PolicyConfig {
  maxRefundAmount: number; // e.g. 500
  returnWindowDays: number; // e.g. 30
}

@Injectable()
export class PolicyEngine {
  private readonly config: PolicyConfig = {
    maxRefundAmount: 500,
    returnWindowDays: 30,
  };

  evaluate(order: OrderEntity, ai: AiClassification | null): PolicyOutcome {
    const rules: PolicyRuleResult[] = [];
    const now = new Date();

    // Rule 1: final sale
    rules.push({
      rule: 'not_final_sale',
      passed: !order.is_final_sale,
      detail: order.is_final_sale ? 'Item marked final sale' : undefined,
    });

    const validReasons = [
      'damaged',
      'incorrect item',
      'not received',
      'changed mind',
    ];
    const hasValidReason =
      ai !== null &&
      validReasons.includes(ai.reason_category) &&
      ai.confidence >= 0.5;

    rules.push({
      rule: 'valid_refund_reason',
      passed: hasValidReason,
      detail: ai
        ? `Reason: ${ai.reason_category}, confidence: ${(ai.confidence * 100).toFixed(0)}%`
        : 'No AI classification available',
    });

    // Rule 2: within return window
    const deliveredAt = order.delivered_at ?? order.ordered_at;
    const daysSince = Math.floor(
      (now.getTime() - deliveredAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    rules.push({
      rule: 'within_return_window',
      passed: daysSince <= this.config.returnWindowDays,
      detail: `${daysSince} days since delivery (limit ${this.config.returnWindowDays})`,
    });

    // Rule 3: refund amount under threshold
    rules.push({
      rule: 'under_auto_approval_threshold',
      passed: order.amount <= this.config.maxRefundAmount,
      detail: `Amount $${order.amount} (limit $${this.config.maxRefundAmount})`,
    });

    // Rule 4: customer not flagged
    rules.push({
      rule: 'customer_not_flagged',
      passed: !order.customer?.is_flagged,
      detail: order.customer?.is_flagged
        ? 'Customer flagged for review'
        : undefined,
    });

    // Rule 5: AI suspicion signal
    const suspicious =
      ai?.flags?.some((f) =>
        ['injection_attempt', 'suspicious', 'conflicting'].includes(f),
      ) ?? false;
    rules.push({
      rule: 'no_suspicious_signals',
      passed: !suspicious,
      detail: suspicious ? `AI flags: ${ai?.flags.join(', ')}` : undefined,
    });

    return this.decide(rules);
  }

  private decide(rules: PolicyRuleResult[]): PolicyOutcome {
    // Hard deny rules
    const denialRule = rules.find(
      (r) =>
        !r.passed &&
        ['not_final_sale', 'within_return_window'].includes(r.rule),
    );
    if (denialRule) {
      return {
        decision: 'denied',
        primary_reason: this.describe(denialRule),
        rules_checked: rules,
      };
    }

    // Escalation rules
    const escalationRule = rules.find(
      (r) =>
        !r.passed &&
        [
          'under_auto_approval_threshold',
          'customer_not_flagged',
          'no_suspicious_signals',
          'valid_refund_reason',
        ].includes(r.rule),
    );
    if (escalationRule) {
      return {
        decision: 'escalated',
        primary_reason: this.describe(escalationRule),
        rules_checked: rules,
      };
    }

    return {
      decision: 'approved',
      primary_reason: 'All policy conditions met',
      rules_checked: rules,
    };
  }

  private describe(rule: PolicyRuleResult): string {
    return rule.detail ?? rule.rule;
  }
}
