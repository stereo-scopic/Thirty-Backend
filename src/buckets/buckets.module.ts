import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bucket, Category, Challenge } from 'src/entities';
import { BucketsController } from './buckets.controller';
import { BucketsService } from './buckets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge, Category, Bucket])],
  providers: [BucketsService],
  controllers: [BucketsController],
})
export class BucketsModule {}
