import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { BucketsModule } from './buckets/buckets.module';
import config from './config/mikroorm.config';
import { Bucket, Category, Challenge } from './entities';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...config,
      autoLoadEntities: true,
    }),
    MikroOrmModule.forFeature({
      entities: [Bucket, Category, Challenge],
    }),
    BucketsModule,
  ],
})
export class AppModule {}
