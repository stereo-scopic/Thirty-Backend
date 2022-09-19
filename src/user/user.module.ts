import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { User } from 'src/entities';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { RewardService } from 'src/reward/reward.service';
import { BucketsService } from 'src/buckets/buckets.service';
import { RelationService } from 'src/relation/relation.service';

@Module({
  imports: [
    forwardRef(() => AuthModule), 
    RewardService,
    BucketsService,
    RelationService,
    MikroOrmModule.forFeature([User])
  ],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
