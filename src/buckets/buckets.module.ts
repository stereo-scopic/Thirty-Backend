import { Module } from '@nestjs/common';
import { Bucket } from 'src/entities';
import { BucketsController } from './buckets.controller';
import { BucketsService } from './buckets.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([Bucket])],
  providers: [BucketsService],
  controllers: [BucketsController],
})
export class BucketsModule {}
