import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './entity/customer.entity';
import { CustomerService } from './service/customer.service';
import { CustomerRepository } from './repository/customer.repository';
import { CustomersController } from './controllers/customer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  providers: [
    CustomerService,
    {
      provide: 'ICustomerRepository',
      useClass: CustomerRepository,
    },
  ],
  controllers: [CustomersController],
  exports: [CustomerService],
})
export class CustomerModule {}
