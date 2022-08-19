import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Bucket, Category, Challenge, User } from 'src/entities';
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

  @Post('/buckets/add/newbie')
  createNewbieAndBucket(
    @Body() createNewbieBucketDto: CreateNewbieBucketDto,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    return this.bucketsService.createNewbieAndBucket(createNewbieBucketDto);
  }

  @Post('/buckets/add/current')
  @UseGuards(AuthGuard())
  createExistingUserBucket(
    @GetUser() user: User,
    @Body('challenge') challenge: number,
  ): Promise<Bucket> {
    return this.bucketsService.createBucket({ user, challenge });
  }
}
