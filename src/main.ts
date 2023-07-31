import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/helper/exception-filter';
import * as session from 'express-session';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);
  dotenv.config();
  const config = new DocumentBuilder()
    .setTitle('Video Meet')
    .setDescription('Video Meet')
    .setVersion('1.0')
    .addTag('backend')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Authorization' },
      'Authorization',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port: number = parseInt(process.env.SERVER_PORT);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  app.use(cookieParser());
  app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port, () => {
    console.log('[API UP]', port);
  });
}
bootstrap();
