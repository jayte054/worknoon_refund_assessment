import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RefundRequestEntity } from '../entity/refund.entity';
import { Repository } from 'typeorm';
import { RefundListOptions } from '../../../utility/interface';
// import { paginatedResponse } from '../../../utility/utility';
import { paginatedResponse } from '../../../utility/utility';

@Injectable()
export class RefundRequestRepository {
  constructor(
    @InjectRepository(RefundRequestEntity)
    private readonly repo: Repository<RefundRequestEntity>,
  ) {}

  create = async (
    data: Partial<RefundRequestEntity>,
  ): Promise<RefundRequestEntity> => {
    return this.repo.save(this.repo.create(data));
  };

  findById = async (id: string): Promise<RefundRequestEntity | null> => {
    return this.repo.findOne({ where: { id } });
  };

  findRecent = async (options: RefundListOptions) => {
    const { decision, skip = 0, take = 20 } = options;

    const qb = this.repo
      .createQueryBuilder('refund')
      .leftJoinAndSelect('refund.order', 'order')
      .leftJoinAndSelect('order.customer', 'customer')
      .orderBy('refund.created_at', 'DESC');

    if (decision) {
      qb.andWhere('refund.decision = :decision', { decision });
    }

    const [requests, total] = await qb.skip(skip).take(take).getManyAndCount();

    return { requests, total };
  };

  findByOrderId = async (orderId: string): Promise<RefundRequestEntity[]> => {
    return await this.repo.find({
      where: { orderId },
      order: { created_at: 'DESC' },
    });
  };

  list = async (options: RefundListOptions) => {
    const { requests, total } = await this.findRecent(options);
    return paginatedResponse({
      data: requests,
      total,
      skip: options.skip,
      take: options.take,
    });
  };
}
