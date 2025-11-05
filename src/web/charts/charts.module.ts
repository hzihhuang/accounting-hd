import { Module } from '@nestjs/common';
import { ChartsService } from './charts.service';
import { ChartsController } from './charts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from '@/web/bills/entities/bill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill])],
  controllers: [ChartsController],
  providers: [ChartsService],
})
export class ChartsModule {}
