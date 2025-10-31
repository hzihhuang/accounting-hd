import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WebModule } from '@/web/web.module';
import { AdminModule } from '@/admin/admin.module';

// 数据表
import { User } from '@/web/user/entities/user.entity';
import { Bill } from '@/web/bills/entities/bill.entity';
import { AdminUser } from '@/admin/user/entities/user.entity';
import { AdminRole } from '@/admin/user/entities/role.entity';
import { AdminPermission } from '@/admin/user/entities/permission.entity';
import { Category } from '@/admin/category/entities/category.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),

    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: '127.0.0.1', // 你的数据库地址
    //   port: 3306, // MySQL 默认端口
    //   username: 'root', // 你的数据库用户名
    //   password: 'hzh0914', // 你的数据库密码
    //   database: 'accounting', // 你的数据库名
    //   entities: [User, Bill, Category, AdminUser, AdminRole, AdminPermission],
    //   synchronize: true, // 自动同步数据库（开发环境可用，生产环境请关闭）
    // }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/images'), // 指定存储图片的目录
      serveRoot: '/images', // 访问 URL 前缀
    }),

    WebModule,
    AdminModule,
  ],
})
export class AppModule {}
