import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Category, Challenge } from 'src/entities';
import { Question } from 'src/entities/questions.entity';
import { BucketsService } from './buckets.service';
import { CreateNewbieBucketDto } from './dto/create-newbie-buckets.dto';

@Controller('')
export class BucketsController {
  constructor(private bucketsService: BucketsService) {}

  @Get('/challenges')
  getAllCategories(): Promise<Category[]> {
    return this.bucketsService.getAllCategories();
  }

  @Get('/challenges/:category-name')
  getChallengeByName(
    @Param('category-name') categoryName: string,
  ): Promise<Challenge[]> {
    return this.bucketsService.getChellengesByCategoryName(categoryName);
  }

  @Get('/challenges/:category-name/:challenge-id')
  getQuestionsByChallengeId(
    @Param('challenge-id', ParseIntPipe) challengeId: number,
  ): Promise<Question[]> {
    return this.bucketsService.getQuestionsByChallengeId(challengeId);
  }

  //   @Post('/buckest/add/current')
  @Post('/buckest/add/newbie')
  createNewbieAndBuckets(
    @Body() createNewbieBucketDto: CreateNewbieBucketDto,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    return this.bucketsService.createNewbieAndBuckets(createNewbieBucketDto);
  }
}
