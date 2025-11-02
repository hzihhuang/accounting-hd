import { Get, Body, Param, Delete, Query, Patch } from '@nestjs/common';
import { BillsService } from './bills.service';
import { GetUser } from '@/web/decorators/getUser.decorator';
import { GetBillsDto } from './dto/get-bills.dto';
import { PatchBillDto } from './dto/patch-bill-dto';
import { WebController } from '@/web/WebController';

@WebController('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Get()
  async findAll(
    @GetUser('userId') userId: number,
    @Query() query: GetBillsDto,
  ) {
    return this.billsService.findAll(userId, query);
  }

  @Delete(':id')
  async remove(@GetUser('userId') userId: number, @Param('id') id: number) {
    return this.billsService.remove(userId, id);
  }

  @Patch(':id')
  async patch(
    @GetUser('userId') userId: number,
    @Param('id') id: number,
    @Body() updateBillDto: PatchBillDto,
  ) {
    return this.billsService.patch(userId, id, updateBillDto);
  }

  @Get('dates')
  async getDates(@GetUser('userId') userId: number) {
    return this.billsService.getDates(userId);
  }
}
