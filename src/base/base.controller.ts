import { Controller, Get, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('')
export class BaseController {
  constructor(private readonly prisma: PrismaService) {}

  // health check
  @Get('/')
  statusRoot() {
    return {
      status: 'ok',
    };
  }

  // health check
  @Get('/status')
  status() {
    return {
      status: 'ok',
    };
  }

  // create a new record on test table
  @Post('/create')
  create() {
    try {
      // create a random hex 6 chars name
      const name = uuidv4().substring(0, 6);

      return this.prisma.test.create({
        data: {
          id: uuidv4(),
          name: name,
          slug: name,
          description: 'testing a new record',
        },
      });
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  // get all records from test table
  @Get('/all')
  all() {
    return this.prisma.test.findMany();
  }
}
