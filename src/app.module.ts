import { NestModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { BucketsController } from './buckets/buckets.controller';
import { BucketsModule } from './buckets/buckets.module';
import { LoggerMiddleware } from './logger.middleware';
import { DataSource } from 'typeorm';

@Module({
  imports: [BucketsModule],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(BucketsController);
  }
}
