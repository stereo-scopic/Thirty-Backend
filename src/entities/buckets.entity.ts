import {
  Entity,
  Property,
  PrimaryKey,
  ManyToOne,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { BucketStatus } from '../buckets/bucket-status.enum';
import { Challenge } from './challenges.entity';
import { User } from './user.entity';
import { Answer } from './answer.entity';

import * as crypto from 'crypto';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Bucket {
  @ApiProperty({
    example: `55b7ca179d58c05154437021d3297a`,
    type: `string`,
    description: `버킷 unique id`,
  })
  @PrimaryKey()
  id: string;

  @ManyToOne()
  user: User;

  @ManyToOne({
    serializer: (value) => value.title,
    serializedName: 'challengeName',
  })
  challenge: Challenge;

  @Property({ default: 0 })
  count: number;

  @OneToMany({
    entity: () => Answer,
    mappedBy: 'bucket',
  })
  answer: Collection<Answer>;

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
