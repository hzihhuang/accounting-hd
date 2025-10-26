import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { WebModule } from '@/web/web.module';
import { AdminModule } from '@/admin/admin.module';

// 数据表
import { User } from '@/web/user/entities/user.entity';
import { Bill } from '@/web/bills/entities/bill.entity';
import { Tag } from '@/web/tags/entities/tag.entity';
import { AdminUser } from '@/admin/user/entities/user.entity';
import { AdminRole } from '@/admin/user/entities/role.entity';
import { AdminPermission } from '@/admin/user/entities/permission.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1', // 你的数据库地址
      port: 3306, // MySQL 默认端口
      username: 'root', // 你的数据库用户名
      password: 'hzh0914', // 你的数据库密码
      database: 'accounting', // 你的数据库名
      entities: [User, Bill, Tag, AdminUser, AdminRole, AdminPermission],
      synchronize: true, // 自动同步数据库（开发环境可用，生产环境请关闭）
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/images'), // 指定存储图片的目录
      serveRoot: '/images', // 访问 URL 前缀
    }),

    WebModule,
    AdminModule,
  ],
})
export class AppModule {}
