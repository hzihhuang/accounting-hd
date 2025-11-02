import { Module } from '@nestjs/common';
import { UserModule } from '@/admin/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { UploadModule } from '@/admin/upload/upload.module';
import { CategoryModule } from '@/admin/category/category.module';
import { BillsModule } from '@/admin/bills/bills.module';
import { JwtAuthGuard } from '@/admin/guards/jwt-auth.guard';
import { RolesGuard } from '@/admin/guards/roles.guard';
import { WebUserModule } from '@/admin/user_web/user.module';

@Module({
  imports: [
    UploadModule,
    UserModule,
    CategoryModule,
    BillsModule,
    WebUserModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AdminModule {}
