import { Module } from '@nestjs/common';
import { UserModule } from '@/web/user/user.module';
import { BillsModule } from '@/web/bills/bills.module';
import { AuthModule } from '@/web/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/web/auth/jwt-auth.guard';

@Module({
  imports: [UserModule, BillsModule, AuthModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class WebModule {}
