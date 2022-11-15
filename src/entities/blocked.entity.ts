import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";
import { User } from "./user.entity";

@Entity()
export class Blocked extends BaseEntity{
    @Property()
    userId: string;

    @Property({ hidden: true })
    targetUserId: string;

    @ManyToOne({
        entity: () => User,
        joinColumn: `target_user_id`,
        referenceColumnName: `id`,
        serializer: (value) => {
            return {
                id: value.id,
                nickname: value.nickname,
            }
        },
        persist: false,
        eager: true,
    })
    targetUser: User;
}
