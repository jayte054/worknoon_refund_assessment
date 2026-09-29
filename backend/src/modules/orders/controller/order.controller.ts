import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { OrderService } from '../service/order.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrderService) {}

  @Get()
  async listForCustomer(
    @Query('customerId') customerId: string,
    @Query('search') search?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return await this.orders.findOrders(customerId, {
      search,
      skip: skip ? Number(skip) : 0,
      take: take ? Number(take) : 20,
    });
  }

  @Get(':orderNumber')
  async getByOrderNumber(@Param('orderNumber') orderNumber: string) {
    const order = await this.orders.findOrder({ order_number: orderNumber });
    if (!order) throw new NotFoundException(`Order ${orderNumber} not found`);
    return order;
  }
}
