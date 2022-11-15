import { Body, Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards';
import { Blocked } from 'src/entities';
import { BlockService } from './block.service';

@ApiTags(`Block`)
@ApiUnauthorizedResponse()
@Controller('block')
@UseGuards(JwtAuthGuard)
export class BlockController {
    constructor(private readonly blockService: BlockService) {}

    @ApiOperation({ summary: `차단 사용자 목록` })
    @ApiOkResponse({
        type: Blocked,
        isArray: true,
    })
    @Get('')
    getBlockedList(@Req() req) {
        return this.blockService.getBlockList(req.user.id);
    }

    @ApiOperation({ summary: `차단 여부` })
    @ApiOkResponse({
        schema: {
            properties: {
                isBlockedUser: {
                    type: `boolean`,
                }
            }
        }
    })
    @Get('/isBlocked')
    isBlocked(@Req() req, @Query('user') targetUserId: string) {
        return this.blockService.isBlockedUser(req.user.id, targetUserId);
    }
}
