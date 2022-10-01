import { NotificationType } from '../notification-type.enum';

export class CreateNotificationDto {
  user_id: string;
  related_user_id: string;
  type: NotificationType;
  message: string;
  related_source_name?: string;
  related_source_id?: string | number;
}
