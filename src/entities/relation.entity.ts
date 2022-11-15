import {
  Entity,
  ManyToOne,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { RelationStatus } from 'src/relation/relation-stautus.enum';

import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity()
export class Relation {
  @PrimaryKey()
  @Property({
    hidden: true,
    nullable: false,
  })
  userId: string;

  @PrimaryKey()
  @ApiProperty({
    example: 'adfa8b368bcd91d3d830',
    description: `친구 user unique id`,
  })
  @Property({
    nullable: false,
  })
  friendId: string;

  @ApiProperty({
    name: `friendNickname`,
    type: `string`,
    example: `오가닉그린`,
    description: `친구 닉네임`,
  })
  @ManyToOne({
    entity: () => User,
    joinColumn: `friend_id`,
    referenceColumnName: `id`,
    serializedName: `friendNickname`,
    serializer: (value) => {
      if (!value) return;
      return value.nickname;
    },
    persist: false,
    eager: true,
  })
  friend: User;

  @ApiProperty({
    example: 'confirmed',
    description: `친구 관계 상태`,
    enum: RelationStatus,
  })
  @Property({ nullable: false, default: RelationStatus.PENDING })
  status: RelationStatus;

  @ApiProperty({
    example: `2022-08-25T00:56:47.000Z`,
    description: `관계 생성 날짜`,
    type: 'datetime',
  })
  @Property({ onCreate: () => new Date() })
  created_at: Date;

  [PrimaryKeyType]?: [string, string];

  constructor(userId: string, friendId: string, status: RelationStatus) {
    this.userId = userId;
    this.friendId = friendId;
    this.status = status;
  }

}
