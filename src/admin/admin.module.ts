import { Module } from '@nestjs/common';
import { UserModule } from '@/admin/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { UploadModule } from '@/admin/upload/upload.module';
import { CategoryModule } from '@/admin/category/category.module';
import { JwtAuthGuard } from '@/admin/guards/jwt-auth.guard';
import { RolesGuard } from '@/admin/guards/roles.guard';

@Module({
  imports: [UserModule, UploadModule, CategoryModule],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AdminModule {}
