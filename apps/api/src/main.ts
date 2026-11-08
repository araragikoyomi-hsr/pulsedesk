import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { Env } from './config/env.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService<Env, true>>(ConfigService)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))
  await app.listen(config.get('PORT', { infer: true }));
}
await bootstrap();
