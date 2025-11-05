import { Module } from '@nestjs/common';
import { UserModule } from '@/admin/user/user.module';
import { APP_GUARD } from '@nestjs/core';
import { UploadModule } from '@/admin/upload/upload.module';
import { CategoryModule } from '@/admin/category/category.module';
import { BillsModule } from '@/admin/bills/bills.module';
import { JwtAuthGuard } from '@/admin/guards/jwt-auth.guard';
import { RolesGuard } from '@/admin/guards/roles.guard';
import { WebUserModule } from '@/admin/user_web/user.module';
import { ChartsModule } from '@/admin/charts/charts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/admin/decorators/user.decorator';
import { Bill } from '@/web/bills/entities/bill.entity';
import { Category } from '@/admin/category/entities/category.entity';
import { AdminUser } from '@/admin/user/entities/user.entity';
import { AdminPermission } from '@/admin/user/entities/permission.entity';
import { AdminRole } from '@/admin/user/entities/role.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `env/.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'), // 127.0.0.1
        port: configService.get<number>('DB_PORT', 3306), // 3306
        username: configService.get('DB_USERNAME'), // root
        password: configService.get('DB_PASSWORD'), // hzh0914
        database: configService.get('DB_DATABASE'), // accounting
        entities: [User, Bill, Category, AdminUser, AdminRole, AdminPermission],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/images'), // 指定存储图片的目录
      serveRoot: '/images', // 访问 URL 前缀
    }),
    UploadModule,
    UserModule,
    CategoryModule,
    BillsModule,
    WebUserModule,
    ChartsModule,
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
