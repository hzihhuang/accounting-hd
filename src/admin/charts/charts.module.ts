import { Module } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { ChartsController } from './charts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from '@/web/bills/entities/bill.entity';
import { Category } from '@/admin/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Category])],
  controllers: [ChartsController],
  providers: [ChartsService],
})
export class ChartsModule {}
