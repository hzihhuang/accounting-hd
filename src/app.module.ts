import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { UserModule } from '@/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/user/entities/user.entity';
import { BillsModule } from '@/bills/bills.module';
import { Bill } from '@/bills/entities/bill.entity';
import { AuthModule } from '@/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { TagsModule } from '@/tags/tags.module';
import { Tag } from '@/tags/entities/tag.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // 你的数据库地址
      port: 3306, // MySQL 默认端口
      username: 'root', // 你的数据库用户名
      password: 'hzh0914', // 你的数据库密码
      database: 'accounting', // 你的数据库名
      entities: [User, Bill, Tag],
      synchronize: true, // 自动同步数据库（开发环境可用，生产环境请关闭）
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public/images'), // 指定存储图片的目录
      serveRoot: '/images', // 访问 URL 前缀
    }),
    UserModule,
    BillsModule,
    AuthModule,
    TagsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule { }
