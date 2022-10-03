import { Entity, Property, Unique } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from './BaseEntity';

@Entity()
export class BucketTheme extends BaseEntity {
  @ApiProperty({
    example: `키치`,
    description: `테마 이름`,
    maxLength: 10,
    uniqueItems: true,
  })
  @Property({
    nullable: false,
    length: 10,
  })
  @Unique()
  name: string;

  @ApiProperty({
    example: `심플한 테마`,
    description: `테마 설명`,
    maxLength: 20,
    nullable: true,
  })
  @Property({
    nullable: true,
    length: 20,
  })
  description: string;

  @ApiProperty({
    example: `https://aws.s3.com/themeimage.png`,
    description: `프레임 이미지 url`,
    nullable: true,
  })
  @Property({
    nullable: true,
  })
  frame: string;
}
