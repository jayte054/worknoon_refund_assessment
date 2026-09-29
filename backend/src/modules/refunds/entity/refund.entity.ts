import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from '../../orders/entity/order.entity';
import {
  AiClassification,
  PolicyEvaluation,
  RefundDecision,
} from '../../../utility/interface';

@Entity('refund_requests')
export class RefundRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'order_id' })
  orderId!: string;

  @ManyToOne(() => OrderEntity, { eager: true })
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;

  @Column('text')
  customer_message!: string;

  @Column({ type: 'jsonb', nullable: true })
  ai_classification!: AiClassification | null;

  @Column({ type: 'jsonb', nullable: true })
  policy_evaluation!: PolicyEvaluation | null;

  @Column({ type: 'varchar' })
  decision!: RefundDecision;

  @Column({ type: 'text', nullable: true })
  decision_reason!: string | null;

  @Column({ type: 'text', nullable: true })
  customer_response!: string | null;

  @Column({ default: false })
  had_injection_attempt!: boolean;

  @CreateDateColumn()
  created_at!: Date;
}
