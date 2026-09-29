import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CustomerEntity } from '../../customer/entity/customer.entity';
import { OrderStatus } from '../../../utility/interface';

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  order_number!: string;

  @Column()
  title!: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount!: number;

  @Column({ name: 'customer_id' })
  customerId!: string;

  @ManyToOne(() => CustomerEntity, (customer) => customer.orders, {
    eager: true,
  })
  @JoinColumn({ name: 'customer_id' })
  customer!: CustomerEntity;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.pending })
  status!: OrderStatus;

  @Column({ default: false })
  is_final_sale!: boolean;

  @Column({ default: false })
  is_damaged!: boolean;

  @Column({ default: false })
  is_incorrect_item!: boolean;

  @Column({ type: 'timestamp' })
  ordered_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  delivered_at!: Date;
}
