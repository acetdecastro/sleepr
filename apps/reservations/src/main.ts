import { NestFactory } from '@nestjs/core';
import { ReservationsModule } from './reservations.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(PinoLogger)); // as reservations app logger
  const configService = app.get(ConfigService);
  const HTTP_PORT = configService.get('HTTP_PORT');
  await app.listen(HTTP_PORT);
  Logger.log(`Reservations REST server is running at port ${HTTP_PORT}`);
}
bootstrap();
