import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class Prize {
  @PrimaryKey({ autoincrement: true })
  @Property()
  id: number;

  @Property()
  @Unique()
  prizeCode: string;

  @Property()
  name: string;

  @Property({ nullable: true })
  description: string;

  @Property()
  illust: string;

  @Property({ defaultRaw: 'current_timestamp' })
  created_at: Date = new Date();

  @Property({
    defaultRaw: 'current_timestamp',
    onUpdate: () => new Date(),
  })
  updated_at: Date = new Date();
}
