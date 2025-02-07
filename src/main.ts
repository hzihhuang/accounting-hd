import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    session({
      secret: 'hzihhuang', // 建议使用环境变量
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // 生产环境应设为 true（需要 HTTPS）
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
