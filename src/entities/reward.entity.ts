import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Prize } from './prize.entity';

@Entity()
@Unique({ properties: ['user_id', 'prize_code'] })
export class Reward extends BaseEntity {
  @Property()
  user_id: string;

  @Property({
    persist: true,
  })
  prize_code: string;

  @ManyToOne({
    entity: () => Prize,
    joinColumn: `prize_code`,
    referenceColumnName: `id`,
    persist: false,
    eager: true,
  })
  prize: Prize;

  constructor(user_id: string, prize: Prize) {
    super();
    this.user_id = user_id;
    this.prize = prize;
  }
}
