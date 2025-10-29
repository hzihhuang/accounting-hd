import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './response.interceptor';
import { HttpExceptionFilter } from './http-exception.filter';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /** 静态 */
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 成功格式
  app.useGlobalInterceptors(new ResponseInterceptor());
  // 异常格式
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局启用 ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ❶ 自动剔除未在 DTO 中定义的属性
      forbidNonWhitelisted: true, // ❷ 如果请求包含未定义属性，则抛出错误
      transform: true, // ❸ 自动转换参数类型（比如 "1" -> 1）
    }),
  );

  // 跨域
  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
