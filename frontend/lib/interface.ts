export interface Order {
  id: string;
  order_number: string;
  title: string;
  amount: number;
  status: string;
  customerId: string;
  is_final_sale: boolean;
  is_damaged: boolean;
  is_incorrect_item: boolean;
  ordered_at: string;
  delivered_at: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  take: number;
  hasMore: boolean;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  is_flagged: boolean;
  notes: string | null;
  createdAt: string;
}

export interface RefundPayload {
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

export type RefundDecision = 'approved' | 'denied' | 'escalated';

export interface AiClassification {
  intent: string;
  mentioned_order_number: string | null;
  reason_category: string;
  confidence: number;
  flags: string[];
  raw_response?: string;
}

export interface PolicyOutcome {
  decision: PolicyDecision;
  primary_reason: string;
  rules_checked: PolicyRuleResult[];
}

export type PolicyDecision = 'approved' | 'denied' | 'escalated';

export interface PolicyRuleResult {
  rule: string;
  passed: boolean;
  detail?: string;
}

export type BackendDecision = 'approved' | 'denied' | 'escalated';

export interface AiClassification {
  intent: string;
  mentioned_order_number: string | null;
  reason_category: string;
  confidence: number;
  flags: string[];
  raw_response?: string;
}

export interface PolicyRuleResult {
  rule: string;
  passed: boolean;
  detail?: string;
}

export interface PolicyEvaluation {
  decision: BackendDecision;
  primary_reason: string;
  rules_checked: PolicyRuleResult[];
}

export interface RefundRequest {
  id: string;
  orderId: string;
  order: Order;               // Order already exists in your interface file
  customer_message: string;
  ai_classification: AiClassification | null;
  policy_evaluation: PolicyEvaluation | null;
  decision: BackendDecision;
  decision_reason: string | null;
  customer_response: string | null;
  had_injection_attempt: boolean;
  created_at: string;
}
