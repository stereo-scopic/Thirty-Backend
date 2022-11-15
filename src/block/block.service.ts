import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Blocked, Report, User } from 'src/entities';
import { RelationService } from 'src/relation/relation.service';
import { CreateBlockDto } from './dto/create-block.dto';

@Injectable()
export class BlockService {
    constructor(
        @InjectRepository(Blocked)
        private readonly blockedRepository: EntityRepository<Blocked>,
        @InjectRepository(Report)
        private readonly reportRepository: EntityRepository<Report>,
        private readonly relationService: RelationService,
    ) {}

    async getBlockList(userId: string) {
        return this.blockedRepository.find({
            userId: userId
        });
    }

    async report(createReportDto: CreateBlockDto): Promise<{ message: string }> {
        this.reportRepository.create(createReportDto);
        await this.reportRepository.flush();

        return await this.block(createReportDto);
    }

    async block(createReportDto: CreateBlockDto): Promise<{ message: string }> {

        const { detail, ...createBlockDto } = createReportDto;

        const haveBlockedOnce: Blocked = await this.findBlocked(createBlockDto.userId, createBlockDto.targetUserId);
        if (haveBlockedOnce) {
            return { message: `이미 차단한 유저입니다.` };
        } 

        const blocked = this.blockedRepository.create(createBlockDto);
        await this.blockedRepository.persistAndFlush(blocked);
        await this.relationService.block(createReportDto.userId, createReportDto.targetUserId);

        return { message: `성공적으로 차단하였습니다.` };
    }

    async unblock(createBlockDto: CreateBlockDto) {
        const { userId, targetUserId } = createBlockDto;
        const blocked: Blocked = await this.findBlocked(userId, targetUserId);

        if (!blocked) {
            throw new Error(`차단하지 않은 유저입니다.`);
        }

        this.blockedRepository.remove(blocked);
        await this.blockedRepository.flush();

        // user와 targetUser가 blocked 상태의 relation을 가지므로
        // relation을 삭제함
        await this.relationService.disconnect(userId, targetUserId);

        return { message: `상대방 차단을 해제하였습니다.` };
    }

    async isBlockedUser(sourceUserId: string, targetUserId: string) {
        const block = await this.findBlocked(sourceUserId, targetUserId);

        if (block) return { isBlockedUser: true };
        return { isBlockedUser: false };
    }

    private async findBlocked(userId: string, targetUserId: string): Promise<Blocked> {
        const block: Blocked = await this.blockedRepository.findOne({
            userId: userId,
            targetUserId: targetUserId,
        });
        if (block) return block;
        return null;
    }
}
