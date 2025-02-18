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
import { GetBillsDto } from './dto/get-bills.dto';

@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) { }

  @Post()
  async create(@GetUser('userId') userId: number, @Body() createBillDto: CreateBillDto) {
    return this.billsService.create(userId, createBillDto);
  }

  @Get()
  async findAll(@GetUser('userId') userId: number, @Query() query: GetBillsDto) {
    const data = await this.billsService.findAll(userId, query);
    return data
  }

  @Delete(':id')
  async remove(@GetUser('userId') userId: number, @Param('id') id: number) {
    return this.billsService.remove(userId, id);
  }
}
