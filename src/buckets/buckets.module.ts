import { Module } from '@nestjs/common';
import { Bucket, Challenge, User } from 'src/entities';
import { BucketsController } from './buckets.controller';
import { BucketsService } from './buckets.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([Bucket, User, Challenge]),
    UserModule,
    BucketsModule,
    AuthModule,
  ],
  providers: [BucketsService],
  controllers: [BucketsController],
})
export class BucketsModule {}
