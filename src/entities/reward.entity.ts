import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Prize } from './prize.entity';
import { User } from './user.entity';

@Entity()
export class Reward extends BaseEntity {
  @Property()
  user_id: string;

  @Property()
  prize_id: number;

  constructor(user_id: string, prize_id: number) {
    super();
    this.user_id = user_id;
    this.prize_id = prize_id;
  }
}
