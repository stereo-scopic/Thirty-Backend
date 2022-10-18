import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { Relation } from 'src/entities';
import { CreateResponseRSVPDto } from './dto/create-resopnse-rsvp.dto';
import { RelationService } from './relation.service';

@ApiTags('Relation')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@Controller('relation')
@UseGuards(JwtAuthGuard)
export class RelationController {
  constructor(private readonly relationService: RelationService) {}

  @ApiOperation({ summary: `친구 목록` })
  @ApiOkResponse({
    type: Relation,
    isArray: true,
  })
  @Get('/')
  async getRelationList(@Req() req): Promise<Relation[]> {
    return this.relationService.getRelationList(req.user);
  }

  @ApiOperation({ summary: `친구 삭제` })
  @ApiBody({
    schema: {
      properties: {
        friend: {
          type: `string`,
          example: `adfa8b368bcd91d3d830`,
          description: `끊으려는 친구의 user id`,
        },
      },
    },
  })
  @ApiOkResponse({
    schema: {
      example: {
        message: '성공적으로 친구를 삭제했습니다.',
      }
    }
  })
  @Delete('')
  async disconnect(
    @Req() req,
    @Body('friendId') objUserId: string,
  ): Promise<any> {
    return this.relationService.disconnect(req.user.id, objUserId);
  }

  @ApiOperation({ summary: `친구 요청` })
  @ApiBody({
    schema: {
      properties: {
        friend: {
          type: `string`,
          description: `친구 신청할 user id`,
        },
      },
    },
  })
  @ApiCreatedResponse({
    schema: {
      example: {
        message: `성공적으로 친구 신청을 보냈습니다.`
      }
    }
  })
  @ApiBadRequestResponse({
    schema: {
      examples: [
        {
          status: 400,
          message: `이미 친구 신청을 보냈거나 친구 관계 입니다.`,
          error: `Bad Request`,
        },
        {
          status: 400,
          message: `옳지 못한 요청입니다: 요청 유저 ID와 친구 신청 유저 ID 동일.`,
          error: `Bad Request`,
        }
      ]
    },
  })
  @Post('')
  async sendRSVP(
    @Req() req,
    @Body('friend') friendId: string,
  ): Promise<{ message: string }> {
    return this.relationService.sendRSVP(req.user, friendId);
  }

  @ApiOperation({ summary: `친구 요청 응답` })
  @ApiBody({ type: CreateResponseRSVPDto })
  @ApiCreatedResponse({
    schema: {
      examples: [
        {
          message: '성공적으로 친구 신청에 수락하였습니다.'
        },
        {
          message: '성공적으로 친구 신청에 거절하였습니다.'
        }
      ]
    }
  })
  @ApiBadRequestResponse({
    schema: {
      examples: [
        {
          statusCode: 400,
          message: `존재하지 않는 친구신청 입니다.`,
          error: `Bad Request`,
        },
        {
          statusCode: 400,
          message: `대기 상태(PENDING)로는 수정 불가능합니다.`,
          error: `Bad Request`,
        },
      ],
    },
  })
  @Post('/RSVP')
  async responseRSVP(
    @Req() req,
    @Body() createResponseRSVPDto: CreateResponseRSVPDto,
  ): Promise<{ message: string }> {
    return this.relationService.responseRSVP(
      req.user.id,
      createResponseRSVPDto,
    );
  }
}
