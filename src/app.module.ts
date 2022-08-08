import { NestModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { DataSource } from 'typeorm';
import { BucketsController } from './buckets/buckets.controller';
import { BucketsModule } from './buckets/buckets.module';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  imports: [TypeOrmModule.forRoot(), BucketsModule, DatabaseModule],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(BucketsController);
  }
}
