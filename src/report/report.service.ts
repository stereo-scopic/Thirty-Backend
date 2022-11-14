import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Blocked, Report, User } from 'src/entities';
import { RelationService } from 'src/relation/relation.service';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Blocked)
        private readonly blockedRepository: EntityRepository<Blocked>,
        @InjectRepository(Report)
        private readonly reportRepository: EntityRepository<Report>,
        private readonly relationService: RelationService,
    ) {}

    async report(createReportDto: CreateReportDto) {
        this.reportRepository.create(createReportDto);
        await this.reportRepository.flush();
        await this.block(createReportDto);
    }

    async block(createReportDto: CreateReportDto) {
        const { detail, ...createBlockDto } = createReportDto;
        const blocked = this.blockedRepository.create(createBlockDto);
        await this.blockedRepository.persistAndFlush(blocked);
        await this.relationService.block(createReportDto.userId, createReportDto.targetUserId);
        
    }
}
