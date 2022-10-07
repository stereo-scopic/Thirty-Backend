import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Stamp extends BaseEntity {
  @Property()
  detail: string;

  @Property({ nullable: true })
  illust: string;
}
