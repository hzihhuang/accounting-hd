import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from '@/web/bills/entities/bill.entity';
import { HomeController } from './home.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Bill])],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
