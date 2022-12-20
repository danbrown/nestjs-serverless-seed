import { ProxyRMQModule } from 'src/proxyRMQ/proxyRMQ.module';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BaseController } from './base.controller';
import { BaseListener } from './base.listener';

@Module({
  imports: [PrismaModule, ProxyRMQModule],
  controllers: [BaseController, BaseListener],
})
export class BaseModule {}
