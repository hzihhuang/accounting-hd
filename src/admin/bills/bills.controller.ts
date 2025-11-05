import {
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  ParseIntPipe,
  Controller,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { GetBillsDto } from './dto/get-bills.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { BatchDeleteBillDto, DeleteBillDto } from './dto/remove-bill.dto';

@Controller('bills')
export class BillsController {
  constructor(private readonly billsService: BillsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async create(@Body() createBillDto: CreateBillDto) {
    return this.billsService.create(createBillDto);
  }

  @Get()
  async findAll(@Query() query: GetBillsDto) {
    return this.billsService.findAll(query);
  }

  @Put(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBillDto: UpdateBillDto,
  ) {
    return this.billsService.update(id, updateBillDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async remove(@Param() params: DeleteBillDto) {
    return this.billsService.remove(params.id);
  }

  @Post('batch')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  async batchRemove(@Body() body: BatchDeleteBillDto) {
    return this.billsService.batchRemove(body.ids);
  }
}
