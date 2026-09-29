import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from '../../orders/entity/order.entity';

@Entity('customers')
export class CustomerEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column()
  email!: string;

  @OneToMany(() => OrderEntity, (order) => order.customer)
  orders!: OrderEntity[];

  @Column({ default: false })
  is_flagged!: boolean;

  @CreateDateColumn({ nullable: false })
  createdAt!: Date;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;
}
