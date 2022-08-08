import { EntityRepository, Repository } from 'typeorm';
import { Bucket } from './entities/buckets.entity';

@EntityRepository(Bucket)
export class BucketsRepository extends Repository<Bucket> {}
