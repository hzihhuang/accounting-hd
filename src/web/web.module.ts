import { Module } from '@nestjs/common';
import { UserModule } from '@/web/user/user.module';
import { BillsModule } from '@/web/bills/bills.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/web/user/jwt-auth.guard';
import { CategoryModule } from '@/web/category/category.module';
import { ChartsModule } from '@/web/charts/charts.module';

@Module({
  imports: [UserModule, BillsModule, CategoryModule, ChartsModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class WebModule {}
