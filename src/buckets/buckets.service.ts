import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';

import { AuthService } from 'src/auth/auth.service';
import { ChallengeService } from 'src/challenge/challenge.service';
import { UserService } from 'src/user/user.service';
import { Answer, Bucket, Challenge, User } from 'src/entities';
import { UserTokenDto } from 'src/user/dto/user-token.dto';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { CreateBucketDto } from './dto/create-bucket.dto';
import { CreateNewbieBucketDto } from './dto/create-newbie-buckets.dto';
import { BucketStatus } from './bucket-status.enum';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { RewardService } from 'src/reward/reward.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class BucketsService {
  constructor(
    private readonly authService: AuthService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => ChallengeService))
    private readonly challengeService: ChallengeService,
    private readonly rewardService: RewardService,
    private readonly notficationService: NotificationService,
    @InjectRepository(Bucket)
    private readonly bucketRepository: EntityRepository<Bucket>,
    @InjectRepository(Answer)
    private readonly answerRepository: EntityRepository<Answer>,
    private readonly em: EntityManager,
  ) {}

  async createBucket(createBucketDto: CreateBucketDto): Promise<{ bucket: Bucket, message: string }> {
    const { user, challenge: challengeId } = createBucketDto;
    if (await this.isSameChallengeBucketWorkedOn(user, challengeId)) {
      throw new BadRequestException(`이미 진행 중인 챌린지 입니다.`);
    }

    const challenge: Challenge = await this.challengeService.getChallengeById(
      challengeId,
    );
    const bucket: Bucket = new Bucket(user, challenge);
    await this.bucketRepository.persistAndFlush(bucket);
    return {
      bucket: bucket,
      message: `${challenge.title} 챌린지를 성공적으로 추가했습니다. 해피 써티!`,
    };
  }

  async createNewbieAndBucket(
    createNewbieBucketDto: CreateNewbieBucketDto,
  ): Promise<UserTokenDto> {
    const { uuid, challenge } = createNewbieBucketDto;

    // check whether challenge exists before create user
    await this.challengeService.getChallengeById(challenge);

    // create new user and create new bucket of user
    const user: User = await this.userService.createUser(uuid);
    await this.createBucket({ user, challenge });

    // generate JWT Access Token to stay logged in
    const accessToken = this.authService.getCookieWithJwtAccessToken(user);
    return {
      access_token: accessToken.access_token,
      refresh_token: user.refreshToken,
    };
  }

  async getUserBucketList(
    user: User,
    status?: BucketStatus,
  ): Promise<Bucket[]> {
    if (!status) {
      return this.bucketRepository.find({
        user: { id: user.id },
      });
    }
    return this.bucketRepository.find({
      user: { id: user.id },
      status: status,
    });
  }

  async getBucketAndAnswersById(bucketId: string): Promise<any> {
    const bucket: Bucket = await this.getBucketById(bucketId);
    const answers = await this.em.execute(`
    select m."date"
         , m.detail as mission
         , a.id as answerId
         , a.music
         , a.detail
         , a.image
         , a.stamp
         , a.created_at
         , a.updated_at
     from mission m
     left join challenge c
       on c.id = m.challenge_id
     left join bucket b
       on b.challenge_id = c.id 
     left join answer a 
       on a.bucket_id = b.id
      and a."date" = m."date"
      and a.is_deleted = false
    where 1=1
      and b.id = '${bucketId}'
    order by m."date";
    `);
    return {
      bucket: bucket,
      answers: answers,
    };
  }

  async getCompletedChallengeBucketCount(user: User): Promise<number> {
    return this.bucketRepository.count({
      user: {
        id: user.id
      },
      status: BucketStatus.COMPLETED,
    });
  }

  async createAnswer(
    user: User,
    bucketId: string,
    createAnswerDto: CreateAnswerDto,
  ): Promise<any> {
    const bucket: Bucket = await this.getBucketById(bucketId);
    this.checkPermission(bucket, user);
    if (!bucket.isBucketWorkedOn()) {
      throw new BadRequestException(`종료된 챌린지 입니다.`);
    }

    let answer: Answer;
    try {
      createAnswerDto.bucket = bucket;
      answer = this.answerRepository.create(createAnswerDto);
      await this.answerRepository.persistAndFlush(answer);
    } catch (error) {
      // duplicate unique key
      if (error.code == 23505)
        throw new BadRequestException(`이미 진행한 챌린지 날짜 입니다.`);
    }

    bucket.count += 1;
    if (bucket.count === 30) {
      bucket.status = BucketStatus.COMPLETED;
      const completedChallengeBucketCount =
        await this.getCompletedChallengeBucketCount(user);
      await this.rewardService.getRewardChallenge(
        user,
        completedChallengeBucketCount + 1,
      );
      // send notification
      this.notficationService.completedBucket(
        user,
        bucket.challenge.title,
        bucket.id,
      );
    } else {
      // send notification
      this.notficationService.registerAnswer(
        user,
        bucket.challenge.title,
        bucket.id,
      );
    }

    this.bucketRepository.persistAndFlush(bucket);
    await this.userService.checkUserAttendance(user);
    await this.rewardService.getRewardAttendance(user);

    return {
      bucketStatus: bucket.status,
      message: '오늘의 챌린지에 답변 달기 성공!'
    };
  }

  async initializeBucket(
    user: User,
    bucketId: string,
  ): Promise<{ message: string }> {
    const bucket: Bucket = await this.bucketRepository.findOne({
      id: bucketId,
    });
    this.checkPermission(bucket, user);

    this.answerRepository.nativeUpdate({ bucket: bucket }, { isDeleted: true });
    bucket.count = 0;

    try {
      await this.answerRepository.flush();
      await this.bucketRepository.flush();
    } catch (error) {
      console.log(error.message);
      throw new BadRequestException(
        `초기화 실패. 관리자에게 문의하세요. | ${error.message}`,
      );
    }

    return { message: `성공적으로 챌린지를 초기화 하였습니다.` };
  }

  async getAnswerByBucketAndDate(bucketId: string, date: number): Promise<any> {
    return (
      await this.em.execute(`
      select a.*
           , m.detail as mission
       from  answer a
       left  join bucket b
         on  b.id = a.bucket_id
       left  join challenge c
         on  c.id = b.challenge_id
       left  join mission m
         on  m.challenge_id = c.id
        and  m.date = a.date
      where  b.id = '${bucketId}'
        and  a.date = ${date}
        and  a.is_deleted = false
        ;
    `)
    )[0];
  }

  async updateAnswer(
    user: User,
    bucketId: string,
    date: number,
    updateAnswerDto: UpdateAnswerDto,
  ): Promise<{ message: string }> {
    const bucket = await this.getBucketById(bucketId);
    this.checkPermission(bucket, user);

    const answer = await this.answerRepository.findOne({
      bucket: bucket,
      date: date,
    });

    try {
      wrap(answer).assign(updateAnswerDto);
      // Check once more image is deleted
      // if (answer.image && updateAnswerDto.image == null) {
      //   answer.image = null;
      // }

      await this.answerRepository.flush();
    } catch (error) {
      throw new BadRequestException(
        `문제가 발생했습니다. 관리자에게 문의하세요.`,
      );
    }

    return { message: '챌린지 답변 수정에 성공했습니다.' };
  }

  async updateBucketStatus(
    bucketId: string,
    status: BucketStatus,
  ): Promise<{ message: string }> {
    const bucket: Bucket = await this.getBucketById(bucketId);
    // TODO: 배포 때 활성화
    // if (!bucket.isPossibleToChangeBucketStatus()) {
    //   throw new BadRequestException(`이미 완료된 챌린지 입니다.`);
    // }
    bucket.status = status;
    await this.bucketRepository.persistAndFlush(bucket);
    return { message: '성공적으로 챌린지 상태를 변경하였습니다.' };
  }

  async getBucketById(id: string): Promise<Bucket> {
    const bucket = await this.bucketRepository.findOne(id);
    if (!bucket) {
      throw new BadRequestException(`존재하지 않는 챌린지 버킷 입니다.`);
    }
    return bucket;
  }

  private async isSameChallengeBucketWorkedOn(
    user: User,
    challengeId: number,
  ): Promise<boolean> {
    const bucket: Bucket[] | void = await this.bucketRepository.find({
      user: user,
      challenge: challengeId,
      status: BucketStatus.WORKING_ON,
    });

    if (bucket.length > 0) {
      return true;
    }
    return false;
  }

  checkPermission(bucket: Bucket, user: User): void {
    if (bucket.user.id !== user.id) {
      throw new ForbiddenException(`챌린지 버킷 주인만 등록, 수정 가능합니다.`);
    }
  }
}
