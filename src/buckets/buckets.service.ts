import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Bucket, Challenge, User } from 'src/entities';
import { UserTokenDto } from 'src/user/dto/user-token.dto';
import { UserService } from 'src/user/user.service';
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
  ) {}

  async createBucket(createBucketDto: CreateBucketDto): Promise<Bucket> {
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

  async getBucketById(bucketId: string): Promise<Bucket> {
    return this.bucketRepository.findOne({ id: bucketId });
  }
}
