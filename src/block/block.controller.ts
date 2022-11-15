import { Body, Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { BlockService } from './block.service';

@Controller('block')
@UseGuards(JwtAuthGuard)
export class BlockController {
    constructor(private readonly blockService: BlockService) {}

    @Get('')
    getBlockedList(@Req() req) {
        return this.blockService.getBlockList(req.user.id);
    }

    @Get('/isBlocked')
    isBlocked(@Req() req, @Query('user') targetUserId: string) {
        return this.blockService.isBlockedUser(req.user.id, targetUserId);
    }
}
