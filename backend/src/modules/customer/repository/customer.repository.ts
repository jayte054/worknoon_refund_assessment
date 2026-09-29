import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from '../entity/customer.entity';
import { Brackets, Repository } from 'typeorm';
import { CustomerOptions } from '../../../utility/interface';
import { paginatedResponse } from '../../../utility/utility';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repo: Repository<CustomerEntity>,
  ) {}

  createCustomer = async (customer: Partial<CustomerEntity>) => {
    return await this.repo.save(customer);
  };

  findCustomer = async (id: string) => {
    return await this.repo.findOne({ where: { id } });
  };

  findCustomers = async (options: CustomerOptions) => {
    const { search, skip, take } = options;
    const customerQuery = this.repo.createQueryBuilder('customer');

    if (search?.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      customerQuery.andWhere(
        new Brackets((inner) => {
          inner
            .where('LOWER(customer.name) LIKE :term', { term })
            .orWhere('LOWER(customer.email) LIKE :term', { term });
        }),
      );
    }

    customerQuery.orderBy('customer.createdAt', 'DESC');

    // ✅ Execute query
    const [customer, total] = await customerQuery
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return paginatedResponse({
      data: customer,
      total,
      skip,
      take,
    });
  };
}
