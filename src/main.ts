import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as FileStore from 'session-file-store';
import { AuthGuard } from './auth/auth.guard';
import { ValidationPipe } from '@nestjs/common';

const FileStoreSession = FileStore(session);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'hzihhuang', // 建议使用环境变量
      resave: false,
      saveUninitialized: false,
      store: new FileStoreSession(),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30天过期
        secure: false, // 如果用 HTTPS，改成 true
        httpOnly: true, // 防止 XSS 攻击
      },
    }),
  );

  // 全局启用 ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ❶ 自动剔除未在 DTO 中定义的属性
      forbidNonWhitelisted: true, // ❷ 如果请求包含未定义属性，则抛出错误
      transform: true, // ❸ 自动转换参数类型（比如 "1" -> 1）
    }),
  );

  app.useGlobalGuards(new AuthGuard()); // 权限守卫
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
