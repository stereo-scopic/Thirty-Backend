import { EntityRepository } from '@mikro-orm/postgresql';
import { Bucket } from '../entities/buckets.entity';

export class BucketsRepository extends EntityRepository<Bucket> {
  // code
}
