import { CustomerOptions } from '../../../utility/interface';
import { CustomerEntity } from '../entity/customer.entity';

export interface ICustomerRepository {
  createCustomer: (
    customer: Partial<CustomerEntity>,
  ) => Promise<CustomerEntity>;
  findCustomer: (id: string) => Promise<CustomerEntity>;
  findCustomers: (options: CustomerOptions) => Promise<CustomerEntity[]>;
}
