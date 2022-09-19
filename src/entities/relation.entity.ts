import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { RelationStatus } from 'src/relation/relation-stautus.enum';


@Entity()
export class Relation {
  @PrimaryKey({ autoincrement: true })
  @Property()
  id: number;

  @Property({ nullable: false })
  subject_user_id: string;

  @ApiProperty({
    example: 'adfa8b368bcd91d3d830',
    description: `친구 user unique id`,
  })
  @Property({ nullable: false })
  object_user_id: string;

  @ApiProperty({
    example: 'c',
    description: `친구 관계 상태 c:친구맺기완료/p:대기중/d:거절`,
    enum: RelationStatus
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
}
