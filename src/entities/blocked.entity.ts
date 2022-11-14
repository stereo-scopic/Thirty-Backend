import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Blocked extends BaseEntity{
    @Property()
    userId: string;

    @Property()
    targetUserId: string;
}
