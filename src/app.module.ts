import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { BucketsModule } from './buckets/buckets.module';
import config from './config/mikroorm.config';
import { Bucket, Category, Challenge } from './entities';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';

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
    AuthModule,
  ],
  providers: [AuthService, UserService],
})
export class AppModule {}
