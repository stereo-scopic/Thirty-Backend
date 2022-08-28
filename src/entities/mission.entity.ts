import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Challenge } from './challenges.entity';

@Entity()
export class Mission {
  @ApiProperty({
    example: 1,
    description: `unique id`,
  })
  @PrimaryKey()
  id: number;

  @ApiProperty({ type: () => Challenge })
  @ManyToOne({
    serializer: (value) => value.title,
    serializedName: 'challengeTitle',
  })
  challenge: Challenge;

  @ApiProperty({
    example: 2,
    description: `미션 수행일`,
  })
  @Property()
  date: number;

  @ApiProperty({
    example: `오늘의 야경을 찍어보자`,
    description: `미션 내용`,
  })
  @Property()
  detail: string;

  constructor(date: number, detail: string) {
    this.date = date;
    this.detail = detail;
  }
}
