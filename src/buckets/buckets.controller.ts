import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Bucket, User } from 'src/entities';
import { BucketsService } from './buckets.service';
import { CreateNewbieBucketDto } from './dto/create-newbie-buckets.dto';

@Controller('buckets')
export class BucketsController {
  constructor(private bucketsService: BucketsService) {}

  @Post('/add/newbie')
  createNewbieAndBucket(
    @Body() createNewbieBucketDto: CreateNewbieBucketDto,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    return this.bucketsService.createNewbieAndBucket(createNewbieBucketDto);
  }

  @Post('/add/current')
  @UseGuards(AuthGuard())
  createExistingUserBucket(
    @GetUser() user: User,
    @Body('challenge') challenge: number,
  ): Promise<Bucket> {
    return this.bucketsService.createBucket({ user, challenge });
  }
}
