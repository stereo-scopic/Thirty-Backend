import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { Bucket } from 'src/entities';
import { UserTokenDto } from 'src/user/dto/user-token.dto';
import { BucketsService } from './buckets.service';
import { CreateNewbieBucketDto } from './dto/create-newbie-buckets.dto';
import { PoliciesGuard } from '../auth/guards';
import { CheckPolicies } from 'src/casl/casl-policy.decorator';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { Action } from 'src/casl/permitted-action.enum';

import {
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Buckets')
@Controller('buckets')
export class BucketsController {
  constructor(private bucketsService: BucketsService) {}

  @ApiOperation({ summary: `새로운 회원 첫 버킷 생성` })
  @ApiBody({
    type: CreateNewbieBucketDto,
  })
  @ApiCreatedResponse({
    type: UserTokenDto,
  })
  @Post('/add/newbie')
  createNewbieAndBucket(
    @Body() createNewbieBucketDto: CreateNewbieBucketDto,
  ): Promise<UserTokenDto> {
    return this.bucketsService.createNewbieAndBucket(createNewbieBucketDto);
  }

  @ApiCookieAuth('Authentication')
  @ApiOperation({ summary: `기존 회원 버킷 생성` })
  @ApiBody({
    schema: {
      properties: {
        challenge: {
          type: `number`,
          example: 1,
          description: `추가할 챌린지 id`,
        },
      },
    },
  })
  @ApiCreatedResponse({
    type: Bucket,
  })
  @UseGuards(JwtAuthGuard)
  @Post('/add/current')
  createExistingUserBucket(
    @Req() req,
    @Body('challenge') challenge: number,
  ): Promise<Bucket> {
    const user = req.user;
    return this.bucketsService.createBucket({ user, challenge });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getUserBucketList(@Req() req): Promise<Bucket[]> {
    return this.bucketsService.getUserBucketList(req.user);
  }

  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @Get('/:bucket_id')
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, Bucket))
  async getBucketById(
    @Req() req,
    @Param('bucket_id') bucketId: string,
  ): Promise<Bucket> {
    console.log('user', req.user);
    return this.bucketsService.getBucketById(bucketId);
  }
}
