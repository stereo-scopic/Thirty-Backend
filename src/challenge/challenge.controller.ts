import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { Category, Challenge, Question } from 'src/entities';
import { ChallengeService } from './challenge.service';

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

  @Get('/:category-name/:challenge-id')
  getQuestionsByChallengeId(
    @Param('challenge-id', ParseIntPipe) challengeId: number,
  ): Promise<Question[]> {
    return this.challengeService.getQuestionsByChallengeId(challengeId);
  }
}
