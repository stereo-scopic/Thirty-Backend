import { NotificationType } from '../notification-type.enum';

export class CreateNotificationDto {
  user_id: string;
  related_user_id: string;
  type: NotificationType;
  message: string;
  related_source_name?: string;
  related_source_id?: string | number;

  constructor(
    userId:string,
    type:NotificationType,
    relatedUserId?: string,
    sourceName?: string,
    sourceId?: string) {
    this.user_id = userId;
    this.type = type;
    this.message = this.getNotificationMessage(type, relatedUserId);
    if (relatedUserId)
      this.related_user_id = relatedUserId;
    
    if (sourceName && sourceId) {
      this.related_source_name = sourceName;
      this.related_source_id = sourceId;
    }
  }

  getNotificationMessage(
    notiType: NotificationType,
    relatedUserId?: string,
    relatedUserChallangeName?: string
  ) {
    return {
      RR0: `${relatedUserId}님이 친구 신청을 보냈습니다.`,
      RR1: `${relatedUserId}님이 친구 신청을 수락했습니다.`,
      RC0: `${relatedUserId}님과 친구가 되었습니다.`,
      BC0: `${relatedUserId}님이 ${relatedUserChallangeName} 챌린지를 완성했습니다!`,
      BA0: `${relatedUserId}님이 ${relatedUserChallangeName} 챌린지에 답변을 달았습니다.`,
    }[notiType];
  };
}
