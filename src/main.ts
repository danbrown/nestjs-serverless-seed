import { AppMicroserviceModule } from './app.microservice.module';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/httpException.filter';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

const logger = new Logger('Microservice');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // add the interceptors and filters
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Microservice listener
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqp://' +
          process.env.RMQ_USER +
          ':' +
          process.env.RMQ_PASSWORD +
          '@' +
          process.env.RMQ_URL,
      ],
      queue: process.env.RMQ_QUEUE,
      noAck: false,
    },
  });

  // create a microservice hybrid app
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000).then(() => {
    logger.log(
      `Main service running on port ${
        process.env.PORT || 3000
      }, and listening on ${process.env.RMQ_QUEUE}...`,
    );
  });
}
bootstrap();
