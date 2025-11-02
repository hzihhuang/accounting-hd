import { Module } from '@nestjs/common';
import { WebUserService } from './user.service';
import { WebUserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/web/user/entities/user.entity';
import { Bill } from '@/web/bills/entities/bill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Bill])],
  controllers: [WebUserController],
  providers: [WebUserService],
})
export class WebUserModule {}
