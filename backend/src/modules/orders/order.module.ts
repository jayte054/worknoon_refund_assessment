import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { OrderService } from './service/order.service';
import { OrderRepository } from './repository/order.repository';
import { CustomerModule } from '../customer/customer.module';
import { OrdersController } from './controller/order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), CustomerModule],
  providers: [
    OrderService,
    {
      provide: 'IOrderRepository',
      useClass: OrderRepository,
    },
  ],
  controllers: [OrdersController],
  exports: [OrderService],
})
export class OrderModule {}
