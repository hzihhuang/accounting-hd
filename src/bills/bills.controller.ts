import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';

@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post()
  async create(@Request() req, @Body() createBillDto: CreateBillDto) {
    return this.billsService.create(req.session.user.id, createBillDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.billsService.findAll(req.session.user.id);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: number) {
    return this.billsService.remove(req.session.user.id, id);
  }

  // 统计
  @Get('statistics')
  async getStatistics(
    @Request() req,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.billsService.getStatistics(req.session.user.id, start, end);
  }
}
