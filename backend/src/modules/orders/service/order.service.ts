import { Inject, Injectable } from '@nestjs/common';
import { IOrderRepository } from '../IOrderRepository/interface';
import {
  CustomerOptions,
  FindOrderOption,
  OrderInterface,
} from '../../../utility/interface';
import { OrderEntity } from '../entity/order.entity';
import { CustomerService } from '../../customer/service/customer.service';

@Injectable()
export class OrderService {
  constructor(
    @Inject('IOrderRepository')
    private readonly orderRepo: IOrderRepository,
    private readonly customerService: CustomerService,
  ) {}

  createOrder = async (payload: OrderInterface) => {
    const order_number = `ORD-${Date.now().toString(36).slice(-6).toUpperCase()}`;
    const orderPayload: Partial<OrderEntity> = {
      title: payload.title,
      amount: payload.amount,
      customerId: payload.customerId,
      order_number,
    };
    const newOrder = await this.orderRepo.createOrder(orderPayload);

    return newOrder;
  };

  findOrder = async (option: FindOrderOption) => {
    const { id, order_number, title } = option;

    const orderOption = {
      ...(id !== undefined && { id }),
      ...(order_number !== undefined && { order_number }),
      ...(title !== undefined && { title }),
    };

    const order = await this.orderRepo.findOrder(orderOption);

    return order;
  };

  findOrders = async (customerId: string, options: CustomerOptions) => {
    const orders = await this.orderRepo.findCustomerOrders(customerId, options);
    return orders;
  };

  toggleOrder = async (
    orderId: string,
    status: 'pending' | 'completed' | 'failed',
  ) => {
    const updatedOrder = await this.orderRepo.toggleOrder(orderId, status);

    return updatedOrder;
  };
}
