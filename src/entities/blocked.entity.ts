import { Entity, ManyToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "./user.entity";

@Entity()
export class Blocked extends BaseEntity{
    @Property()
    userId: string;

    @ManyToMany({
        entity: () => User,
        joinColumn: `userId`,
        referenceColumnName: `id`,
        persist: false,
    })
    user: User;

    @Property()
    blockedUserId: string;

    @ManyToMany({
        entity: () => User,
        joinColumn: `blockedUserId`,
        referenceColumnName: `id`,
        persist: false,
    })
    blockedUser: User;

    constructor(userId: string, blockedUserId: string) {
        super();
        this.userId = userId;
        this.blockedUserId = blockedUserId;
    }
}
