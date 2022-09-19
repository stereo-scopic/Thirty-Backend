import { RelationStatus } from "../relation-stautus.enum";

export class CreateResponseRSVPDto {
    object_user_id: string;
    status: RelationStatus;
}