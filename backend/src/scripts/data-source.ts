import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { CustomerEntity } from '../modules/customer/entity/customer.entity';
import { OrderEntity } from '../modules/orders/entity/order.entity';
import { RefundRequestEntity } from '../modules/refunds/entity/refund.entity';
// import { CustomerEntity } from '../customers/entity/customer.entity';
// import { OrderEntity } from '../orders/entity/order.entity';
// import { RefundRequestEntity } from '../refunds/entity/refund.entity';

config(); // load .env

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [CustomerEntity, OrderEntity, RefundRequestEntity],
  synchronize: true, // dev only — creates tables if they don't exist
  logging: false,
});
