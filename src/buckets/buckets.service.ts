import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Bucket } from 'src/entities';
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
  ) {}

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
