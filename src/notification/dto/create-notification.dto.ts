import { NotificationType } from '../notification-type.enum';

export class CreateNotificationDto {
  user_id: string;
  relation_user_id: string;
  type: NotificationType;
  // messagge: NotificationMessage;
  object_id?: string;
}
