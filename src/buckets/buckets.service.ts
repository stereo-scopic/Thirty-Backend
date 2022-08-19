import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';
import { Bucket, Category, Challenge, Question, User } from 'src/entities';
import { UserTokenDto } from 'src/user/dto/user-token.dto';
import { UserService } from 'src/user/user.service';
import { CreateBucketDto } from './dto/create-bucket.dto';
import { CreateNewbieBucketDto } from './dto/create-newbie-buckets.dto';

@Injectable()
export class BucketsService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Bucket)
    private readonly bucketRepository: EntityRepository<Bucket>,
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    @InjectRepository(Challenge)
    private readonly challengeRepository: EntityRepository<Challenge>,
    @InjectRepository(Question)
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

  async createBucket(createBucketDto: CreateBucketDto): Promise<Bucket> {
    return this.bucketRepository.create(createBucketDto);
  }

  async createNewbieAndBucket(
    createNewbieBucketDto: CreateNewbieBucketDto,
  ): Promise<UserTokenDto> {
    const { uuid, challenge } = createNewbieBucketDto;
    const userToken = await this.userService.createUser(uuid);
    const user = await this.userService.getByUuid(uuid);

    await this.createBucket({ user, challenge });
    return userToken;
  }
}
