import {
  PaginatedResponseInterface,
  RefundListOptions,
} from '../../../utility/interface';
import { RefundRequestEntity } from '../entity/refund.entity';

export interface IRefundRequestRepository {
  create: (data: Partial<RefundRequestEntity>) => Promise<RefundRequestEntity>;
  findById: (id: string) => Promise<RefundRequestEntity | null>;
  findRecent: (
    options: RefundListOptions,
  ) => Promise<{ requests: RefundRequestEntity; total: number }>;
  findByOrderId(orderId: string): Promise<RefundRequestEntity[]>;
  list: (
    options: RefundListOptions,
  ) => Promise<PaginatedResponseInterface<RefundRequestEntity>>;
}
