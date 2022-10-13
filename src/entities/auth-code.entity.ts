import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { User } from "./user.entity";

@Entity()
export class AuthCode {
    @PrimaryKey()
    @Property()
    userId: string;

    @OneToOne({
        entity: () => User,
        joinColumn: 'user_id',
        inverseJoinColumn: 'id',
        eager: false,
        persist: false,
    })
    user: User;

    @Property({ nullable: false })
    code: number;

    @Property({ onCreate: () => new Date() })
    created_at: Date;

    constructor(user: User) {
        const [min, max] = [100001, 999999];
        this.user = user;
        this.userId = user.id;
        this.code = Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
