export interface OrderInterface {
  title: string;
  amount: number;
  customerId: string;
  //   customer: {
  //     name: string;
  //     email: string;
  //   };
}

export interface FindOrderOption {
  id?: string;
  order_number?: string;
  title?: string;
}

export interface OrderOptions {
  search?: string;
  status?: OrderStatus;
  skip: number;
  take: number;
}

export interface CustomerOptions {
  search?: string;
  skip: number;
  take: number;
}

export enum OrderStatus {
  pending = 'pending',
  completed = 'completed',
  failed = 'failed',
  delivered = 'delivered',
}

export interface PaginatedRequestInterface<T> {
  data: T[];
  total: number;
  skip: number;
  take: number;
}

export interface PaginatedResponseInterface<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  hasMore: boolean;
}

export interface RefundListOptions {
  decision?: RefundDecision;
  skip: number;
  take: number;
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

export interface PolicyEvaluation {
  rules_checked: Array<{ rule: string; passed: boolean; detail?: string }>;
  primary_reason: string;
  decision: RefundDecision;
}
