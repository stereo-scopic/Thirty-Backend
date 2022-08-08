import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BucketsRepository } from './buckets.repository';

@Injectable()
export class BucketsService {
  // constructor(private bucketRepository: BucketsRepository) {}
  constructor(
    @InjectRepository(BucketsRepository)
    private challengeRepository: BucketsRepository,
  ) {}

  private readonly challenges: Challenge[] = [];

  findAll(): Promise<Challenge[]> {
    return this.challengeRepository.find();
  }

  findOne(category: string): Promise<Challenge> {
    return this.challengeRepository.findOneBy({ category });
  }

  //   async remove(id: string): Promise<void> {
  //     await this.usersRepository.delete(id);
  //   }
}
