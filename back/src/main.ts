import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/loggerGlobal';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins =
    process.env.DOMAIN_FRONT?.split(',').map((origin) => origin.trim()) || [];
  console.log('Dominios admitidos en cors', allowedOrigins);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(loggerGlobal);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const options = new DocumentBuilder()
    .setTitle('NeuroBotIA Api')
    .setDescription('**NeuroBotIA Api** ')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT);
  console.log(`🚀Servidor corriendo en el puerto ${PORT}`);
  console.log('🌍 Dominios admitidos en CORS:', allowedOrigins);
}
bootstrap();
