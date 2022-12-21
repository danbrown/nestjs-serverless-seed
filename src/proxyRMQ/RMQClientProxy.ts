import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
  RmqOptions,
} from '@nestjs/microservices';

@Injectable()
export class RMQClientProxy {
  getClient(
    queue = process.env.RMQ_QUEUE,
    urls = [process.env.RMQ_URL],
    options: RmqOptions = {},
  ): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      ...options,
      options: {
        urls,
        queue,
        ...options.options,
      },
    });
  }
}
