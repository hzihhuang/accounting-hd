import { Module } from '@nestjs/common';
import { UserModule } from '@/web/user/user.module';
import { BillsModule } from '@/web/bills/bills.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/web/jwt-auth.guard';
import { CategoryModule } from '@/web/category/category.module';
import { ChartsModule } from '@/web/charts/charts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/web/user/entities/user.entity';
import { Bill } from '@/web/bills/entities/bill.entity';
import { Category } from '@/admin/category/entities/category.entity';
import { AdminUser } from '../admin/user/entities/user.entity';
import { AdminRole } from '../admin/user/entities/role.entity';
import { AdminPermission } from '../admin/user/entities/permission.entity';

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
    UserModule,
    BillsModule,
    CategoryModule,
    ChartsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class WebModule {}
