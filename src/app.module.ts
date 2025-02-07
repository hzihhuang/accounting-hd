import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost', // 你的数据库地址
      port: 3306, // MySQL 默认端口
      username: 'root', // 你的数据库用户名
      password: 'hzh0914', // 你的数据库密码
      database: 'accounting', // 你的数据库名
      entities: [User],
      synchronize: true, // 自动同步数据库（开发环境可用，生产环境请关闭）
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
