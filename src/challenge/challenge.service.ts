import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Category, Challenge, Mission } from 'src/entities';
import { CreateMissionDto } from './dto/create-mission.dto';

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

  async getMissionsByChallengeId(challengeId: number): Promise<Challenge> {
    return this.challengeRepository.findOneOrFail(
      { id: challengeId },
      { populate: ['missions'] },
    );
  }

  async registerChallengeMissions(
    missions: CreateMissionDto[],
    challengeId: number,
  ): Promise<Challenge> {
    const challenge = await this.challengeRepository.findOne(
      { id: challengeId },
      { populate: ['missions'] },
    );
    for (const mission of missions) {
      const { date, detail } = mission;
      const mission_ = new Mission(date, detail);
      challenge.missions.add(mission_);
      mission_.challenge = challenge;
      await this.missionRepository.persistAndFlush(mission_);
    }

    return challenge;
  }
}
