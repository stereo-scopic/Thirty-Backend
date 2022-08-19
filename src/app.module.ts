import { MikroOrmMiddleware, MikroOrmModule } from '@mikro-orm/nestjs';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  OnModuleInit,
} from '@nestjs/common';
import { BucketsModule } from './buckets/buckets.module';
import config from './config/mikroorm.config';
import { UserModule } from './user/user.module';
import { ChallengeModule } from './challenge/challenge.module';
import { MikroORM } from '@mikro-orm/core';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...config,
      autoLoadEntities: true,
    }),
    BucketsModule,
    AuthModule,
    UserModule,
    ChallengeModule,
  ],
})
export class AppModule {}
