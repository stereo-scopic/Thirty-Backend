import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Category, Challenge, Mission } from 'src/entities';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';

@Module({
  imports: [MikroOrmModule.forFeature([Category, Challenge, Mission])],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}
