import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Transport } from '@nestjs/microservices';
import { Logger as PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  app.useLogger(app.get(PinoLogger)); // as reservations app logger
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0', // bind all available IP addresses on the machine
      port: configService.get('TCP_PORT'),
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
