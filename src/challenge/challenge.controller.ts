import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Category, Challenge } from 'src/entities';
import { ChallengeService } from './challenge.service';
import { CreateMissionDto } from './dto/create-mission.dto';

import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Challenges')
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

  @ApiOperation({ summary: `챌린지 상세 조회` })
  @ApiResponse({
    status: 200,
    description: `Return Challenge`,
    type: Challenge,
  })
  @Get('/:category/:id')
  getQuestionsByChallengeId(
    @Param('id', ParseIntPipe) challengeId: number,
  ): Promise<Challenge> {
    return this.challengeService.getChallengeById(challengeId);
  }

  @ApiOperation({ summary: `챌린지 내 미션 등록` })
  @ApiCreatedResponse({
    description: `Return Challenge`,
    type: Challenge,
  })
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
