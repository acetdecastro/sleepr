import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(PinoLogger)); // as auth app logger
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port);
  Logger.log(`Authentication REST server is running at port ${port}`);
}
bootstrap();
