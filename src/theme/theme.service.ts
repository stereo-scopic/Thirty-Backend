import { QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { BucketStatus } from 'src/buckets/bucket-status.enum';
import { BucketsService } from 'src/buckets/buckets.service';
import { BucketTheme, ExportLog, User } from 'src/entities';

@Injectable()
export class ThemeService {
  constructor(
    private readonly bucketService: BucketsService,
    @InjectRepository(ExportLog)
    private readonly logRepository: EntityRepository<ExportLog>,
    @InjectRepository(BucketTheme)
    private readonly themeRepository: EntityRepository<BucketTheme>,
  ) {}

  async exportBucketTheme(
    user: User,
    bucketId: string,
    themeId: number,
  ): Promise<void> {
    const bucket = await this.bucketService.getBucketById(bucketId);
    // Check Permssion
    this.bucketService.checkPermission(bucket, user);

    // Check Is Bucket Completed
    if (bucket.status != BucketStatus.COMPLETED) {
      throw new BadRequestException(
        `완료되지 않은 챌린지는 내보낼 수 없습니다.`,
      );
    }

    // Log Export Bucket history
    const log = new ExportLog(user.id, bucketId, themeId);
    await this.logRepository.persistAndFlush(log);
  }

  async getThemeList(): Promise<BucketTheme[]> {
    return this.themeRepository.findAll({
      orderBy: {
        id: QueryOrder.ASC,
      },
    });
  }
}
