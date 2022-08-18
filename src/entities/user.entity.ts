import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { UserType } from '../auth/user-type.enum';
import { UserVisiblity } from 'src/auth/user-visibility.enum';

import * as crypto from 'crypto';

@Entity()
export class User {
  @PrimaryKey()
  id: string;

  @Property({ unique: true })
  uuid: string;

  @Property({ nullable: true })
  email: string;

  @Property({ nullable: true })
  password: string;

  @Property({ nullable: true })
  nickname: string;

  @Property({ defaultRaw: 'current_timestamp()' })
  dateJoined: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ default: UserType.BASIC })
  type: UserType;

  @Property({ default: UserVisiblity.PRIVATE })
  visibility: UserVisiblity;

  constructor(uuid: string) {
    this.uuid = uuid;
    this.id = crypto.randomBytes(10).toString('hex');
  }
}
