import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Prize } from './prize.entity';

@Entity()
@Unique({ properties: ['userId', 'prizeCode'] })
export class Reward extends BaseEntity {
  @Property()
  userId: string;

  @Property({ persist: true })
  prizeCode: string;

  @ManyToOne({
    entity: () => Prize,
    joinColumn: `prize_code`,
    referenceColumnName: `id`,
    persist: false,
  })
  prize: Prize;

  constructor(userId: string, prize: Prize) {
    super();
    this.userId = userId;
    this.prize = prize;
  }
}
