import {
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { GetBillsDto } from './dto/get-bills.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { AdminController } from '@/admin/AdminController';

@AdminController('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post()
  async create(@Body() createBillDto: CreateBillDto) {
    return this.billsService.create(createBillDto);
  }

  @Get()
  async findAll(@Query() query: GetBillsDto) {
    return this.billsService.findAll(query);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.billsService.remove(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBillDto: UpdateBillDto,
  ) {
    return this.billsService.update(id, updateBillDto);
  }

  // // 批量删除
  // @Delete('batch')
  // async batchRemove(@Body('ids') ids: number[]) {
  //   return this.billsService.batchRemove(ids);
  // }
}
