import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity, Category, User } from '../entities';

@Entity()
export class Challenge extends BaseEntity {
  @Property()
  title: string;

  @Property()
  description: string;

  @Property({ default: true })
  is_public: boolean;

  @ManyToOne({
    entity: () => Category,
    onDelete: 'cascade',
  })
  category: Category;

  @ManyToOne({
    entity: () => User,
    nullable: true,
  })
  author: User;
}
