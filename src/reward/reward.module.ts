import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Prize, Reward } from 'src/entities';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Prize, Reward])],
  exports: [RewardService],
  providers: [RewardService],
  controllers: [RewardController],
})
export class RewardModule {}
