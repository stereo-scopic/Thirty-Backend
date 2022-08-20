import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Category extends BaseEntity {
  @Property({ unique: true })
  name: string;

  @Property()
  description: string;
}
