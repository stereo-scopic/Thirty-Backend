import { Entity, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { Reward } from './reward.entity';

@Entity()
export class Prize {
  @PrimaryKey({ autoincrement: true })
  @Property()
  id: number;

  @Property()
  @Unique()
  prize_code: string;

  @Property()
  name: string;

  @Property()
  illust: string;

  @Property({ defaultRaw: 'current_timestamp' })
  created_at: Date = new Date();

  @Property({
    defaultRaw: 'current_timestamp',
    onUpdate: () => new Date(),
  })
  updated_at: Date = new Date();

  @OneToMany({
    entity: () => Reward,
    mappedBy: `prize_code`,
  })
  reward: Reward;
}
