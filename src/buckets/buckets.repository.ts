import { EntityRepository } from '@mikro-orm/postgresql';
import { Bucket } from '../entities/buckets.entity';
import { CreateBucketDto } from './dto/create-bucket.dto';
import { CreateNewbieBucketDto } from './dto/create-newbie-buckets.dto';

export class BucketsRepository extends EntityRepository<Bucket> {
  async createNewbieBucket(
    createNewbieBucketDto: CreateNewbieBucketDto,
  ): Promise<Bucket> {
    const { uuid, challenge } = createNewbieBucketDto;
    return this.create({
      user: { uuid: uuid },
      challenge: challenge,
    });
  }
}
