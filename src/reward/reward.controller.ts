import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { RewardService } from './reward.service';
import { PrizeUserOwnedDto } from './dto/prize-user-owned.dto';

import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('reward')
@ApiTags('Reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @ApiOperation({ summary: `리워드 보유 목록` })
  @ApiBearerAuth()
  @ApiOkResponse({
    type: PrizeUserOwnedDto,
    isArray: true,
  })
  @Get('')
  @UseGuards(JwtAuthGuard)
  async getUserRewardsList(@Req() req): Promise<PrizeUserOwnedDto[]> {
    return this.rewardService.getUserRewardsList(req.user);
  }
}
