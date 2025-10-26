import { Module } from '@nestjs/common';
import { UserModule } from '@/admin/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/admin/user/jwt-auth.guard';

@Module({
  imports: [UserModule],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AdminModule {}
