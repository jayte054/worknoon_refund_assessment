import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CustomerService } from '../service/customer.service';
import { CreateCustomerDto } from '../../../utility/dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customers: CustomerService) {}

  @Get()
  async list(
    @Query('search') search: string,
    @Query('skip') skip: number,
    @Query('take') take: number,
  ) {
    return await this.customers.findCustomers({
      search,
      skip,
      take,
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.customers.findCustomer(id);
  }

  @Post('/create')
  async create(@Body() payload: CreateCustomerDto) {
    return await this.customers.createCustomer(payload);
  }
}
