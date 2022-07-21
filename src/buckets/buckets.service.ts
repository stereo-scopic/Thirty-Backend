import { Injectable } from '@nestjs/common';
import { BucketsRepository } from './buckets.repository';
import { Challenge } from './interfaces/bucket.interface';

@Injectable()
export class BucketsService {
    constructor(private bucketRepository: BucketsRepository) {}

    private readonly challenges: Challenge[] = [];

    findAll(): Challenge[] { 
        return this.challenges;
    }
}
