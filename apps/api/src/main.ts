import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConfigService } from '@nestjs/config';
import { Env } from './config/env.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService<Env, true>>(ConfigService)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }))
  const doc = new DocumentBuilder().setTitle('PulseDesk Api').setDescription('Bruh').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, doc);
  SwaggerModule.setup('api/docs', app, document)
  app.enableCors()
  await app.listen(config.get('PORT', { infer: true }));
}
await bootstrap();
