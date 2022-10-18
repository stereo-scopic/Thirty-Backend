import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { Bucket, Answer } from 'src/entities';
import { UserTokenDto } from 'src/user/dto/user-token.dto';
import { CreateNewbieBucketDto } from './dto/create-newbie-buckets.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { BucketsService } from './buckets.service';
import { BucketsDetail } from './dto/buckets-detail.dto';
import { BucketStatus } from './bucket-status.enum';
import { uploadFileOnAwsS3Bucket } from 'src/utils/file-upload';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@ApiTags('Buckets')
@Controller('buckets')
export class BucketsController {
  constructor(private bucketsService: BucketsService) {}

  @ApiOperation({ summary: `새로운 회원 첫 버킷 생성` })
  @ApiBody({ type: CreateNewbieBucketDto })
  @ApiCreatedResponse({ type: UserTokenDto })
  @ApiBadRequestResponse({
    status: 400,
    schema: {
      properties: {
        statusCode: {
          type: `number`,
          example: 400,
        },
        message: {
          type: `string`,
          examples: [
            `존재하지 않는 챌린지 입니다.`,
            `이미 가입한 기록이 있습니다.`,
          ],
        },
        error: {
          type: `string`,
          example: `Bad Request`,
        },
      },
    },
  })
  @Post('/add/newbie')
  createNewbieAndBucket(
    @Body() createNewbieBucketDto: CreateNewbieBucketDto,
  ): Promise<UserTokenDto> {
    return this.bucketsService.createNewbieAndBucket(createNewbieBucketDto);
  }

  @ApiBearerAuth('Authentication')
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
    schema: {
      properties: {
        bucket: {
          type: getSchemaPath(Bucket),
        },
        message: {
          type: `string`,
          example: `사진찍기 챌린지를 성공적으로 추가했습니다. 해피 써티!`
        }
      }
    }
  })
  @ApiBadRequestResponse({
    status: 400,
    schema: {
      examples: [
        {
          statusCode: 400,
          message: '존재하지 않는 챌린지 입니다.',
          error: 'Bad Request'
        },
        {
          statusCode: 400,
          message: '이미 진행 중인 챌린지 입니다.',
          error: 'Bad Request'
        },
      ],
    },
  })
  @UseGuards(JwtAuthGuard)
  @Post('/add/current')
  createExistingUserBucket(
    @Req() req,
    @Body('challenge') challenge: number,
  ): Promise<{ message: string }> {
    const user = req.user;
    return this.bucketsService.createBucket({ user, challenge });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `유저의 챌린지 버킷 리스트` })
  @ApiQuery({
    name: `status`,
    type: `string`,
    enum: BucketStatus,
    enumName: `버킷 진행 상태`,
    required: false,
    description: `포함X:전체/WRK: 진행중/CMP:완료/ABD:중단`,
  })
  @ApiResponse({
    status: 200,
    description: `Return User's Challenge Bucket List`,
    type: Bucket,
    isArray: true,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getUserBucketList(
    @Req() req,
    @Query('status') status?: BucketStatus,
  ): Promise<Bucket[]> {
    return this.bucketsService.getUserBucketList(req.user, status);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `챌린지 버킷 상세 조회` })
  @ApiResponse({
    status: 200,
    description: `버킷 상세 조회`,
    type: BucketsDetail,
  })
  @UseGuards(JwtAuthGuard)
  @Get('/:bucket_id')
  async getBucketById(
    @Param('bucket_id') bucketId: string,
  ): Promise<BucketsDetail> {
    return this.bucketsService.getBucketAndAnswersById(bucketId);
  }

  @Post('/:bucket_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: `답변 등록` })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateAnswerDto })
  @ApiCreatedResponse({
    schema: {
      properties: {
        bucketStatus: {
          type: `string`,
          enum: Object.values(BucketStatus),
          description: `WRK: 진행중, CMP: 완료, ABD: 중단`,
        },
        message: {
          type: `string`,
          example: `오늘의 챌린지에 답변 달기 성공!`,
        },
      },
    },
  })
  @ApiForbiddenResponse({
    schema: {
      example: {
        statusCode: 403,
        message: `챌린지 버킷 주인만 등록, 수정 가능합니다.`,
        error: `Forbidden`,
      },
    },
  })
  @ApiBadRequestResponse({
    schema: {
      examples: [
        {
          statusCode: '400',
          message: '종료된 챌린지 입니다.',
          error: 'Bad Request'
        },
        {
          statusCode: '400',
          message: '이미 진행한 챌린지 날짜 입니다.',
          error: 'Bad Request'
        },
      ]
    }
  })
  @UseInterceptors(FileInterceptor('image'))
  async createAnswer(
    @Req() req,
    @Param('bucket_id') bucketId: string,
    @Body() createAnswerDto: CreateAnswerDto,
    @UploadedFile() imageFile?,
  ): Promise<any> {
    const uploadedImageUrl = await uploadFileOnAwsS3Bucket(imageFile, 'test');
    if (uploadedImageUrl) {
      createAnswerDto.image = uploadedImageUrl;
    }
    return this.bucketsService.createAnswer(
      req.user,
      bucketId,
      createAnswerDto,
    );
  }

  @ApiOperation({ summary: `챌린지 초기화` })
  @ApiBadRequestResponse({
    schema: {
      example: {
        statusCode: 400,
        message: '초기화 실패. 관리자에게 문의하세요.',
        error: 'Bad Request',
      }
    }
  })
  @ApiOkResponse({
    schema: {
      example: {
        message: '성공적으로 챌린지를 초기화 하였습니다.'
      }
    }
  })
  @Delete('/:bucket_id')
  @UseGuards(JwtAuthGuard)
  initializeBucket(
    @Req() req,
    @Param('bucket_id') bucketId: string,
  ): Promise<{ message: string }> {
    return this.bucketsService.initializeBucket(req.user, bucketId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `답변 상세 조회` })
  @ApiResponse({
    status: 200,
    type: Answer,
  })
  @Get('/:bucket_id/date/:date')
  @UseGuards(JwtAuthGuard)
  async getAnswerDetail(
    @Param('bucket_id') bucketId: string,
    @Param('date', ParseIntPipe) date: number,
  ): Promise<Answer> {
    return this.bucketsService.getAnswerByBucketAndDate(bucketId, date);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `답변 수정` })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateAnswerDto })
  @ApiOkResponse({
    schema: {
      example: {
        message: '챌린지 답변 수정에 성공했습니다.',
      }
    }
  })
  @ApiForbiddenResponse({
    schema: {
      example: {
        statusCode: 403,
        message: `챌린지 버킷 주인만 등록, 수정 가능합니다.`,
        error: `Forbidden`,
      },
    },
  })
  @Patch('/:bucket_id/date/:date')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateAnswer(
    @Req() req,
    @Param('bucket_id') bucketId: string,
    @Param('date', ParseIntPipe) date: number,
    @Body() updateAnswerDto: UpdateAnswerDto,
    @UploadedFile() imageFile?,
  ): Promise<any> {
    const uploadedImageUrl = await uploadFileOnAwsS3Bucket(imageFile, 'test');
    if (uploadedImageUrl) {
      updateAnswerDto.image = uploadedImageUrl;
    }
    return this.bucketsService.updateAnswer(
      req.user,
      bucketId,
      date,
      updateAnswerDto,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: `챌린지 버킷 상태 업데이트` })
  @ApiBody({
    schema: {
      properties: {
        status: {
          type: `string`,
          enum: Object.values(BucketStatus),
          example: `ABD`,
        },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      example: {
        message: '성공적으로 챌린지 상태를 변경하였습니다.'
      }
    }
  })
  @Patch('/:bucket_id/status')
  @UseGuards(JwtAuthGuard)
  async updateBucketStatus(
    @Req() req,
    @Param('bucket_id') bucketId: string,
    @Body('status') status: BucketStatus,
  ): Promise<{ message: string }> {
    return this.bucketsService.updateBucketStatus(bucketId, status);
  }
}
