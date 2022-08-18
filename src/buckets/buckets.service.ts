import { MikroORM } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { BucketsRepository } from './buckets.repository';

@Injectable()
export class BucketsService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    private readonly repo: BucketsRepository,
  ) {}
}
