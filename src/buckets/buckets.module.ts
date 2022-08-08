import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Challenge } from 'src/entity/Challenge';
import { BucketsController } from './buckets.controller';
import { BucketsService } from './buckets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Challenge])],
  providers: [BucketsService],
  controllers: [BucketsController],
})
export class BucketsModule {}
