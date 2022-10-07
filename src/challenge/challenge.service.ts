import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Category, Challenge, Mission, User } from 'src/entities';
import { CreateMissionDto } from './dto/create-mission.dto';
import { CreateChallengeDto, CreateOwnChallengeDto } from './dto/create-own-challenge.dto';

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
    user?: User,
  ): Promise<Challenge[]> {
    const defaultChallenges = await this.challengeRepository.find({
      category: {
        name: categoryName,
      },
      is_public: true,
    });
    if (!user) {
      return defaultChallenges;
    }

    const userOwnChallenges = await this.challengeRepository.find({
      category: {
        name: categoryName,
      },
      author: user
    })
    return [
      ...defaultChallenges,
      ...userOwnChallenges,
    ];
  }

  async getChallengeById(challengeId: number): Promise<Challenge> {
    try {
      const challenge = await this.challengeRepository.findOneOrFail(
        { id: challengeId },
        { populate: ['missions'] },
      );
      return challenge;
    } catch (e) {
      throw new BadRequestException(`존재하지 않는 챌린지 입니다.`);
    }
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
    }
    await this.challengeRepository.persistAndFlush(challenge);
    return challenge;
  }

  async createOwnChallenge(
    user: User,
    createOwnChallengeDto: CreateOwnChallengeDto
  ): Promise<Challenge> {
    const { challenge: createChallengeDto, missions } = createOwnChallengeDto;
    createChallengeDto.author = user;

    let challenge: Challenge;
    let category: Category;

    const {
      category: categoryName,
      ...newChallengeInfo
    } = createChallengeDto;
    if (categoryName) {
      category = await this.categoryRepository.findOne({ name: categoryName });
    } else {
      category = null;
    }
    const newChallengeDto: CreateChallengeDto<Category> = {
      category,
      ...newChallengeInfo
    };
    challenge = this.challengeRepository.create(newChallengeDto);
    await this.challengeRepository.persistAndFlush(challenge);

    return this.registerChallengeMissions(
      missions,
      challenge.id,
    );
  }
}
