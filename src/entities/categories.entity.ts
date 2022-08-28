import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';

import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category extends BaseEntity {
  @ApiProperty({ example: '취미', description: '카테고리 이름' })
  @Property({ unique: true })
  name: string;

  @ApiProperty({
    example: '모든 종류의 취미 챌린지',
    description: '카테고리 설명',
  })
  @Property()
  description: string;
}
