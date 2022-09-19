import { Body, Controller, Delete, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { string } from 'joi';
import { JwtAuthGuard } from 'src/auth/guards';
import { Relation } from 'src/entities';
import { RelationService } from './relation.service';

@ApiTags('Relation')
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@Controller('relation')
@UseGuards(JwtAuthGuard)
export class RelationController {
    constructor(
        private readonly relationService: RelationService
    ) {}

    @ApiOperation({ summary: `친구 목록` })
    @ApiOkResponse({
        type: Relation,
        isArray: true
    })
    @Get('/')
    async getRelationList(@Req() req): Promise<Relation[]> {
        return this.relationService.getRelationList(req.user);
    }

    @ApiOperation({ summary: `친구 삭제` })
    @ApiBody({
        schema: {
            properties: {
                subject_user_id: {
                    type: `string`,
                    example: `adfa8b368bcd91d3d830`,
                    description: `끊으려는 친구의 user id`
                }
            }
        }
    })
    @ApiOkResponse()
    @Delete('')
    async deleteRelation(@Req() req, @Body('subject_user_id') subUserId: string): Promise<void> {
        return this.relationService.deleteRelation(req.user, subUserId);
    }
}
