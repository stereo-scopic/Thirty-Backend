import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class AuthCode {
  @PrimaryKey()
  @Property()
  email: string;

  @Property({ nullable: false })
  code: number;

  @Property({ onCreate: () => new Date() })
  created_at: Date;

  constructor(email: string) {
    this.email = email;

    const [min, max] = [100001, 999999];
    this.code = Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
