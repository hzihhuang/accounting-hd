import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as FileStore from 'session-file-store';
import { AuthGuard } from './auth/auth.guard';

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

  app.useGlobalGuards(new AuthGuard()); // 权限守卫
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
