import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { GetUser } from '@/decorators/getUser.decorator';

@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) { }

  @Post()
  async create(@Request() req, @Body() createBillDto: CreateBillDto) {
    return this.billsService.create(1, createBillDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.billsService.findAll(1);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number) {
    return this.billsService.remove(1, id);
  }

  // 统计
  @Get('statistics')
  async getStatistics(
    @GetUser("userId") userId: number,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.billsService.getStatistics(userId, start, end);
  }
}
