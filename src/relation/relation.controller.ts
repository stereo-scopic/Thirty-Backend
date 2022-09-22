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
  @ApiOkResponse()
  @Delete('')
  async disconnect(
    @Req() req,
    @Body('friend') objUserId: string,
  ): Promise<void> {
    return this.relationService.disconnect(req.user, objUserId);
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
  @ApiCreatedResponse({ type: Relation })
  @Post('')
  async sendRSVP(
    @Req() req,
    @Body('friend') objUserId: string,
  ): Promise<Relation> {
    return this.relationService.sendRSVP(req.user, objUserId);
  }

  @ApiOperation({ summary: `친구 요청 응답` })
  @ApiBody({ type: CreateResponseRSVPDto })
  @ApiCreatedResponse({
    type: Relation,
    isArray: true,
  })
  @ApiBadRequestResponse()
  @Post('/RSVP')
  async responseRSVP(
    @Req() req,
    @Body() createResponseRSVPDto: CreateResponseRSVPDto,
  ): Promise<void> {
    return this.relationService.responseRSVP(req.user, createResponseRSVPDto);
  }
}
