import {
  Entity,
  Property,
  PrimaryKey,
  ManyToOne,
  ManyToMany,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { BucketStatus } from 'src/buckets/bucket-status.enum';
import { BucketsRepository } from 'src/buckets/buckets.repository';
import { Challenge } from './challenges.entity';
import { User } from './user.entity';

@Entity()
export class Bucket {
  [EntityRepositoryType]?: BucketsRepository;

  @PrimaryKey()
  id: string;

  @ManyToOne({
    serializer: (value) => value.id,
    serializedName: 'userId',
  })
  user: User;

  @ManyToMany({
    serializer: (value) => value.title,
    serializedName: 'challengeName',
  })
  challenge: Challenge;

  @Property({ default: 0 })
  count: number;

  @Property({ default: BucketStatus.WRK })
  status: BucketStatus;

  @Property({ defaultRaw: 'current_timestamp()' })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  constructor(user: User, challenge: Challenge) {
    this.user = user;
    this.challenge = challenge;
  }
}
