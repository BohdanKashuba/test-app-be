import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import {
  InternalServerErrorException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PORT_EXCEPTION } from './common/messages/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const PORT = parseInt(configService.getOrThrow('PORT'));
  const VERSION = configService.getOrThrow('API_VERSION');

  if (isNaN(PORT)) {
    throw new InternalServerErrorException(PORT_EXCEPTION);
  }

  app.enableCors({ origin: true });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: VERSION });
  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe({ errorHttpStatusCode: 422 }));

  await app.listen(PORT);
}
bootstrap();
