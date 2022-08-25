import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Category, Challenge, Mission } from 'src/entities';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    @InjectRepository(Challenge)
    private readonly challengeRepository: EntityRepository<Challenge>,
    @InjectRepository(Mission)
    private readonly missionRepository: EntityRepository<Mission>,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({});
  }

  async getChellengesByCategoryName(
    categoryName: string,
  ): Promise<Challenge[]> {
    return this.challengeRepository.find({
      category: {
        name: categoryName,
      },
    });
  }

  async getMissionsByChallengeId(challengeId: number): Promise<Mission[]> {
    return this.missionRepository.find({ challenge: challengeId });
  }
}
