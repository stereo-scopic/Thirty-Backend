import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Prize extends BaseEntity {
  @Property()
  name: string;

  @Property()
  illust: string;
}
