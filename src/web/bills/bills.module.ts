import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { Category } from '@/admin/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Category])],
  controllers: [BillsController],
  providers: [BillsService],
})
export class BillsModule {}
