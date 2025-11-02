import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from '@/web/bills/entities/bill.entity';
import { Category } from '@/admin/category/entities/category.entity';
import { User } from '@/web/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Category, User])],
  controllers: [BillsController],
  providers: [BillsService],
})
export class BillsModule {}
