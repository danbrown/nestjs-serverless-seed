import { Controller, Get, Logger, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { RMQClientProxy } from '../proxyRMQ/RMQClientProxy';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';

@Controller('')
export class BaseListener {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clientProxy: RMQClientProxy,
  ) {}

  private readonly logger = new Logger(BaseListener.name);
  private authClient = this.clientProxy.getClient('auth-queue');

  // create a project post
  @MessagePattern('test-getTests')
  async getTests(@Payload() payload: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef(); // get channel ref
    const originalMessage = context.getMessage(); // get original message

    // const { data } = payload;

    try {
      const tests = await this.prisma.test.findMany();

      console.log('tests', tests);

      channel.ack(originalMessage); // acknowledge message

      return tests;
    } catch (error) {
      this.logger.error(error);
      channel.ack(originalMessage); // acknowledge message
      throw new RpcException(error);
    }
  }
}
