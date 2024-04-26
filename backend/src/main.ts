import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TextUnitService } from './text-unit/text-unit.service';
import { environment } from './environment';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { readFileSync } from 'fs';

const loadTextUnits = (app: INestApplication) => {
  const textUnitService = app.get(TextUnitService);
  return textUnitService.loadTextUnitsFromDisc();
};

async function bootstrap() {
  let httpsOptions = undefined;

  if (environment.ENABLE_HTTPS) {
    httpsOptions = {
      key: readFileSync('../cert/key.pem'),
      cert: readFileSync('../cert/cert.pem'),
    };
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });

  if (!environment.PROD) {
    app.useStaticAssets(join(__dirname, '../..', 'upload'), {
      prefix: '/upload',
      setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
      },
    });
  }

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

  if (environment.LOAD_TEXT_UNITS) {
    await loadTextUnits(app);
  }

  await app.listen(environment.PORT);
}
bootstrap();
