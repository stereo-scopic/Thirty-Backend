import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { BucketStatus } from '../buckets/bucket-status.enum';
import { Challenge } from './challenges.entity';
import { User } from './user.entity';

import * as crypto from 'crypto';

@Entity()
export class Bucket {
  @PrimaryKey()
  id: string;

  @ManyToOne({
    serializer: (value) => value.id,
    serializedName: 'userId',
  })
  user: User;

  @ManyToOne({
    serializer: (value) => value.title,
    serializedName: 'challengeName',
  })
  challenge: Challenge;

  @Property({ default: 0 })
  count: number;

  @Property({ type: 'string', default: BucketStatus.WORKING_ON })
  status: BucketStatus;

  @Property({ defaultRaw: 'current_timestamp' })
  created_at: Date = new Date();

  @Property({
    defaultRaw: 'current_timestamp',
    onUpdate: () => new Date(),
  })
  updated_at: Date = new Date();

  constructor(user: User, challenge: Challenge) {
    this.id = crypto.randomBytes(15).toString('hex');
    this.user = user;
    this.challenge = challenge;
  }
}
