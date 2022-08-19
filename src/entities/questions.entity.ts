import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Challenge } from './challenges.entity';

@Entity()
export class Question {
  @PrimaryKey()
  id: number;

  @ManyToOne({
    serializer: (value) => value.title,
    serializedName: 'challengeTitle',
  })
  challenge: Challenge;

  @Property()
  date: number;

  @Property()
  detail: string;
}
