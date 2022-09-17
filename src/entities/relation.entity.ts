import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

export enum RelationStatus {
  PENDING = 'p',
  CONFIRMED = 'c',
  DENIED = 'd',
}

@Entity()
export class Relation {
  @PrimaryKey({ autoincrement: true })
  @Property()
  id: number;

  @Property({ nullable: false })
  subject_user_id: string;

  @Property({ nullable: false })
  object_user_id: string;

  @Property({ nullable: false, default: RelationStatus.PENDING })
  status: RelationStatus;

  @Property({ onCreate: () => new Date() })
  created_at: Date;
}
