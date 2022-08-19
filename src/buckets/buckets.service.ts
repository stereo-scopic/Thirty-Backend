import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Category, Challenge, Question } from 'src/entities';
import { UserService } from 'src/user/user.service';
import { BucketsRepository } from './buckets.repository';
import { CreateNewbieBucketDto } from './dto/create-newbie-buckets.dto';

@Injectable()
export class BucketsService {
  constructor(
    private readonly userService: UserService,
    private readonly bucketsRepository: BucketsRepository,
    private readonly categoryRepository: EntityRepository<Category>,
    private readonly challengeRepository: EntityRepository<Challenge>,
    private readonly questionRepository: EntityRepository<Question>,
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

  async getQuestionsByChallengeId(challengeId: number): Promise<Question[]> {
    return this.questionRepository.find({ challenge: challengeId });
  }

  async createNewbieAndBucket(
    createNewbieBucketDto: CreateNewbieBucketDto,
  ): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const userToken = await this.userService.createUser(
      createNewbieBucketDto.uuid,
    );

    await this.bucketsRepository.createNewbieBucket(createNewbieBucketDto);

    return userToken;
  }
}
