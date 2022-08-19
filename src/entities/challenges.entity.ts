import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity, Category, User } from '../entities';

@Entity()
export class Challenge extends BaseEntity {
  @Property()
  title: string;

  @Property()
  description: string;

  @Property()
  is_public: boolean;

  @ManyToOne({
    entity: 'Category',
  })
  category: Category;

  @ManyToOne({
    entity: 'User',
  })
  author: User;
}
