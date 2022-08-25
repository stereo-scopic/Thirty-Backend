import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Category, Challenge, Mission } from 'src/entities';
import { ChallengeService } from './challenge.service';
import { CreateMissionDto } from './dto/create-mission.dto';

@Controller('challenges')
export class ChallengeController {
  constructor(private challengeService: ChallengeService) {}

  @Get('')
  getAllCategories(): Promise<Category[]> {
    return this.challengeService.getAllCategories();
  }

  @Get('/:category')
  getChallengeByName(
    @Param('category') categoryName: string,
  ): Promise<Challenge[]> {
    return this.challengeService.getChellengesByCategoryName(categoryName);
  }

  @Get('/:category/:id')
  getQuestionsByChallengeId(
    @Param('id', ParseIntPipe) challengeId: number,
  ): Promise<Challenge> {
    return this.challengeService.getMissionsByChallengeId(challengeId);
  }

  @Post('/:category/:id')
  registerChallengeMissions(
    @Param('id', ParseIntPipe) challengeId: number,
    @Body('missions') missions: CreateMissionDto[],
  ): Promise<Challenge> {
    console.log('missions', missions);
    return this.challengeService.registerChallengeMissions(
      missions,
      challengeId,
    );
  }
}
