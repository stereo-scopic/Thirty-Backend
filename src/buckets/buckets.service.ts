import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Answer, Bucket, Challenge, User } from 'src/entities';
import { UserTokenDto } from 'src/user/dto/user-token.dto';
import { BucketStatus } from './bucket-status.enum';
import { BucketsDetail } from './dto/buckets-detail.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { CreateBucketDto } from './dto/create-bucket.dto';
import { CreateNewbieBucketDto } from './dto/create-newbie-buckets.dto';

@Injectable()
export class BucketsService {
  constructor(
    // private readonly userService: UserService,
    private readonly authService: AuthService,
    @InjectRepository(Bucket)
    private readonly bucketRepository: EntityRepository<Bucket>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Challenge)
    private readonly challengeRepository: EntityRepository<Challenge>,
    @InjectRepository(Answer)
    private readonly answerRepository: EntityRepository<Answer>,
  ) {}

  async createBucket(createBucketDto: CreateBucketDto): Promise<Bucket> {
    const { user } = createBucketDto;
    if (await this.isSameChallengeBucketWorkedOn(user))
      throw new BadRequestException(`이미 진행 중인 챌린지 입니다.`);
    return this.bucketRepository.create(createBucketDto);
  }

  async createNewbieAndBucket(
    createNewbieBucketDto: CreateNewbieBucketDto,
  ): Promise<UserTokenDto> {
    const { uuid, challenge: challengeId } = createNewbieBucketDto;

    const refreshToken = this.authService.getRefreshToken(uuid);
    let user: User = null;
    try {
      user = new User(uuid, refreshToken);
      await this.userRepository.persistAndFlush(user);
    } catch (error) {
      // duplicate unique key
      if (error.code == 23505)
        throw new BadRequestException(`이미 가입한 기록이 있습니다.`);
      throw new BadRequestException(`가입할 수 없습니다`);
    }

    const accessToken = this.authService.getCookieWithJwtAccessToken(user);
    const challenge = await this.challengeRepository.findOne({
      id: challengeId,
    });
    const bucket = new Bucket(user, challenge);
    this.bucketRepository.persistAndFlush(bucket);
    return {
      access_token: accessToken.access_token,
      refresh_token: refreshToken,
    };
  }

  async getUserBucketList(user: User): Promise<Bucket[]> {
    return this.bucketRepository.find({
      user: {
        id: user.id,
      },
    });
  }

  async getBucketById(bucketId: string): Promise<BucketsDetail> {
    const bucket = await this.bucketRepository.findOne({ id: bucketId });
    const answers = await this.answerRepository.find({
      bucket: {
        id: bucketId,
      },
    });
    return {
      bucket: bucket,
      answers: answers,
    };
  }

  async createAnswer(
    bucketId: string,
    imageFileUrl: string,
    createAnswerDto: CreateAnswerDto,
  ): Promise<Answer> {
    const bucket = await this.bucketRepository.findOne({
      id: bucketId,
    });

    createAnswerDto.bucket = bucket;
    createAnswerDto.image = imageFileUrl;

    const answer = this.answerRepository.create(createAnswerDto);
    this.answerRepository.persistAndFlush(answer);

    bucket.count += 1;
    this.bucketRepository.persistAndFlush(bucket);

    return answer;
  }

  async getAnswerByBucketAndDate(
    bucketId: string,
    date: number,
  ): Promise<Answer> {
    return this.answerRepository.findOne({
      bucket: {
        id: bucketId,
      },
      date: date,
    });
  }

  private async isSameChallengeBucketWorkedOn(user: User): Promise<boolean> {
    const bucket = await this.bucketRepository.find({
      user: user,
      status: BucketStatus.WORKING_ON,
    });
    if (bucket) return true;
    return false;
  }
}
