import { NotificationType } from "src/entities";

export class CreateNotificationDto {
    user_id: string;
    relation_user_id: string;
    type: NotificationType;
    object_id?: string;
}
