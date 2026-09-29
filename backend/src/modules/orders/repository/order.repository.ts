import { Injectable } from '@nestjs/common';
import { Brackets, Repository } from 'typeorm';
import { OrderEntity } from '../entity/order.entity';
// import { DataSource } from 'typeorm';
// import { OrderInterface } from '../../../utility/interface';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOrderOption,
  OrderOptions,
  OrderStatus,
} from '../../../utility/interface';
import { paginatedResponse } from '../../../utility/utility';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repo: Repository<OrderEntity>,
  ) {}

  createOrder = async (order: Partial<OrderEntity>) => {
    return await this.repo.save(order);
  };

  findOrder = async (option: FindOrderOption) => {
    const { id, title, order_number } = option;
    // const order: OrderEntity;

    if (id) {
      return await this.repo.findOne({ where: { id } });
    }

    if (title) {
      return await this.repo.findOne({ where: { title } });
    }

    if (order_number) {
      return await this.repo.findOne({ where: { order_number } });
    }
  };

  findCustomerOrders = async (customerId: string, options: OrderOptions) => {
    const { status, search, skip, take } = options;
    const orderQuery = this.repo
      .createQueryBuilder('order')
      .where('order.customerId = :customerId', { customerId });

    if (search?.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      orderQuery.andWhere(
        new Brackets((inner) => {
          inner
            .where('LOWER(order.order_number) LIKE :term', { term })
            .orWhere('LOWER(order.description) LIKE :term', { term });
        }),
      );
    }

    if (status) {
      orderQuery.andWhere('order.status = :status', { status });
    }

    orderQuery.orderBy('order.ordered_at', 'DESC');

    // ✅ Execute query
    const [orders, total] = await orderQuery
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return paginatedResponse({
      data: orders,
      total,
      skip,
      take,
    });
  };

  toggleOrder = async (
    orderId: string,
    status: 'pending' | 'completed' | 'failed',
  ) => {
    const order = await this.repo.findOne({ where: { id: orderId } });

    if (!order) return;

    order.status =
      status === 'completed'
        ? OrderStatus.completed
        : status === 'failed'
          ? OrderStatus.failed
          : OrderStatus.pending;

    return await order.save();
  };
}
