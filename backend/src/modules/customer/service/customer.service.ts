import { Inject, Injectable } from '@nestjs/common';
import { ICustomerRepository } from '../ICustomerRepository/interface';
import { CustomerEntity } from '../entity/customer.entity';
import { CustomerOptions } from '../../../utility/interface';

@Injectable()
export class CustomerService {
  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepo: ICustomerRepository,
  ) {}

  createCustomer = async (payload: Partial<CustomerEntity>) => {
    const newCustomer = await this.customerRepo.createCustomer(payload);
    return newCustomer;
  };

  findCustomers = async (options: CustomerOptions) => {
    const customers = await this.customerRepo.findCustomers(options);
    return customers;
  };

  findCustomer = async (id: string) => {
    return await this.customerRepo.findCustomer(id);
  };
}
