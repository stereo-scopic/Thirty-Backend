import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { isArray } from 'class-validator';
import { JwtAuthGuard } from 'src/auth/guards';
import { Relation } from 'src/entities';
import { RelationService } from './relation.service';

@ApiTags('Relation')
@ApiBearerAuth()
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
}
