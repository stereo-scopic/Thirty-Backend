import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { Bucket } from './buckets.entity';

@Entity()
export class Answer extends BaseEntity {
  @ManyToOne({
    entity: () => Bucket,
  })
  bucket: Bucket;

  @Property({ nullable: true })
  music: string;

  @Property({ nullable: false })
  date: number;

  @Property({ nullable: true })
  detail: string;

  @Property({ nullable: true })
  image: string;

  @Property({ nullable: false })
  stamp: number;
}
