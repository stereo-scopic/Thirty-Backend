import { Entity, Property, PrimaryKey, ManyToOne } from '@mikro-orm/core';
import { BucketStatus } from '../buckets/bucket-status.enum';
import { Challenge } from './challenges.entity';
import { User } from './user.entity';

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

  @ApiProperty({
    example: `55b7ca179d58c05154437021d3297a`,
    name: `userId`,
    type: `string`,
    description: `user unique id`,
  })
  @ManyToOne({
    serializedName: 'userId',
    serializer: (u) => u.id,
  })
  user: User;

  @ApiProperty({
    type: () => Challenge,
  })
  @ManyToOne({ eager: true })
  challenge: Challenge;

  @ApiProperty({
    example: 1,
    type: `number`,
    description: `현재 챌린지 답변 개수`,
  })
  @Property({ default: 0 })
  count: number;

  @ApiProperty({
    example: BucketStatus.WORKING_ON,
    type: `string`,
    enum: BucketStatus,
    description: `챌린지 상태\nWRK: 챌린지 진행중/CMP: 챌린지 완료/ABD: 챌린지 중단`,
  })
  @Property({ type: 'string', default: BucketStatus.WORKING_ON })
  status: BucketStatus;

  @ApiProperty({
    example: `2022-08-25T00:56:47.000Z`,
    description: `등록 날짜`,
  })
  @Property({ defaultRaw: 'current_timestamp' })
  created_at: Date = new Date();

  @ApiProperty({
    example: `2022-08-25T00:56:47.000Z`,
    description: `수정 날짜`,
  })
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
