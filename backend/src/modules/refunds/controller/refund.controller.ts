import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RefundsService } from '../service/refund-request.service';
import { RefundDecision } from '../../../utility/interface';

class ProcessRefundDto {
  orderNumber!: string;
  customerMessage!: string;
}

@Controller('refunds')
export class RefundsController {
  constructor(private readonly refunds: RefundsService) {}

  @Post('/initiate')
  async process(@Body() body: ProcessRefundDto) {
    return await this.refunds.process({
      orderNumber: body.orderNumber,
      customerMessage: body.customerMessage,
    });
  }

  @Get()
  async list(
    @Query('decision') decision?: RefundDecision,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    return await this.refunds.list({
      decision,
      skip: skip ? Number(skip) : 0,
      take: take ? Number(take) : 20,
    });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.refunds.getById(id);
  }
}
