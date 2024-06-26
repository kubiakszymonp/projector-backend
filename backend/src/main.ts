import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { readFileSync } from 'fs';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ENVIRONMENT } from './environment';

async function bootstrap() {

  console.log('ENVIRONMENT', ENVIRONMENT)
  console.log("process.env", process.env)

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(ENVIRONMENT.FILE_UPLOAD_PATH, {
    prefix: '/upload',
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    },
  });

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
  });

  app.useBodyParser('json', { limit: '50mb' });

  const config = new DocumentBuilder()
    .setTitle('Projector')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: '/swagger.json',
  });

  app.useGlobalPipes(new ValidationPipe());

  app.useWebSocketAdapter(new IoAdapter(app.getHttpServer()));

  await app.listen(ENVIRONMENT.PORT);
}
bootstrap();
