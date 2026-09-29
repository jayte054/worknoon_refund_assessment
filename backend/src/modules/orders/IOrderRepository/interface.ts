import { FindOrderOption, OrderOptions } from '../../../utility/interface';
import { OrderEntity } from '../entity/order.entity';

export interface IOrderRepository {
  createOrder: (order: Partial<OrderEntity>) => Promise<OrderEntity>;
  findOrder: (option: FindOrderOption) => Promise<OrderEntity>;
  findCustomerOrders: (
    customerId: string,
    options: OrderOptions,
  ) => Promise<OrderEntity[]>;
  toggleOrder: (
    orderId: string,
    status: 'pending' | 'completed' | 'failed',
  ) => Promise<OrderEntity>;
}
