import { Entity, Property } from "@mikro-orm/core";
import { NotificationType } from "src/notification/notification-type.enum";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Notification extends BaseEntity {
    @Property()
    user_id: string;

    @Property({ nullable: true })
    relation_user_id: string;

    @Property()
    type: NotificationType;

    @Property({ nullable: true })
    object_id: string;

    @Property({ default: false })
    is_read: boolean;
}
