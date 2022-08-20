import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { UserType } from '../user/user-type.enum';
import { UserVisiblity } from '../user/user-visibility.enum';

import * as crypto from 'crypto';

@Entity()
export class User {
  @PrimaryKey({ autoincrement: false })
  id!: string;

  @Property({ unique: true })
  uuid: string;

  @Property({ nullable: true, unique: true })
  email: string;

  @Property({ nullable: true })
  password: string;

  @Property({ nullable: true })
  nickname: string;

  @Property({ defaultRaw: 'current_timestamp' })
  date_joined: Date = new Date();

  @Property({
    defaultRaw: 'current_timestamp',
    onUpdate: () => new Date(),
  })
  updated_at: Date = new Date();

  @Property({ type: 'string', default: UserType.BASIC })
  type: UserType;

  @Property({ type: 'string', default: UserVisiblity.PRIVATE })
  visibility: UserVisiblity;

  @Property({ nullable: true })
  refreshToken: string;

  constructor(uuid: string) {
    this.uuid = uuid;
    this.id = crypto.randomBytes(10).toString('hex');
  }
}

// @ManyToMany(() => Bucket, bucket => bucket.user, { hidden: true })
// buckets: new Collection<Bucket>(this);

// @OneToMany(() => User, user => user.friends, { hidden: true })
// friends: new Collection<User>(this);
