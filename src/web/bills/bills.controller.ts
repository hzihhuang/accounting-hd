import {
  Get,
  Body,
  Delete,
  Query,
  Put,
  Post,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { User } from '@/web/decorators/getUser.decorator';
import { WebController } from '@/web/WebController';
import { GetBillsDto } from './dto/get-bills.dto';
import { CreateBillDto } from './dto/create-bill.dto';
import { DeleteBillDto } from './dto/delete-bill.dto';
import { UpdateBillDto } from './dto/update-bill-dto';

@WebController('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Get()
  async findAll(@Query() getBillsDto: GetBillsDto, @User('id') id: number) {
    return this.billsService.findAll(getBillsDto, id);
  }

  @Post()
  async create(@Body() createBillDto: CreateBillDto, @User('id') id: number) {
    return this.billsService.create(createBillDto, id);
  }

  @Delete(':id')
  async remove(@Param() params: DeleteBillDto, @User('id') id: number) {
    return this.billsService.remove(params, id);
  }

  @Put(':id')
  async put(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBillDto: UpdateBillDto,
    @User('id') userId: number,
  ) {
    return this.billsService.put(id, updateBillDto, userId);
  }
}
