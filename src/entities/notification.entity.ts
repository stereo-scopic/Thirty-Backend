import { Entity, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
import { NotificationType } from 'src/notification/notification-type.enum';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Notification extends BaseEntity {
  @ApiProperty({
    example: `adfa8b368bcd91d3d830`,
    description: `user unique id`,
    type: 'string',
  })
  @Property()
  user_id: string;

  @ApiProperty({
    example: `abcdefgt1234`,
    description: `관련 user unique id`,
    type: 'string',
  })
  @Property({ nullable: true })
  related_user_id: string;

  @ApiProperty({
    type: `string`,
    enum: NotificationType,
    description: `알림 종류\n`,
  })
  @Property()
  type: NotificationType;

  @ApiProperty({
    type: `string`,
    description: ``,
  })
  @Property({ nullable: true })
  message: string;

  @Property({ nullable: true })
  related_source_name: string;

  @Property({ nullable: true })
  related_source_id: string | number;

  @ApiProperty({
    type: `boolean`,
    example: false,
    description: ``,
  })
  @Property({ default: false })
  is_read: boolean;

  constructor(createNotificationDto: CreateNotificationDto) {
    super();
    const { userId, type, relatedUserId, sourceName, sourceId } =
      createNotificationDto;
    this.user_id = userId;
    this.type = type;
    this.message = this.getNotificationMessage(type, relatedUserId);
    if (relatedUserId) this.related_user_id = relatedUserId;

    if (sourceName && sourceId) {
      this.related_source_name = sourceName;
      this.related_source_id = sourceId;
    }
  }

  private getNotificationMessage(
    notiType: NotificationType,
    relatedUserId?: string,
    relatedUserChallangeName?: string,
  ) {
    return {
      RR0: `${relatedUserId}님이 친구 신청을 보냈습니다.`,
      RR1: `${relatedUserId}님이 친구 신청을 수락했습니다.`,
      RC0: `${relatedUserId}님과 친구가 되었습니다.`,
      BC0: `${relatedUserId}님이 ${relatedUserChallangeName} 챌린지를 완성했습니다!`,
      BA0: `${relatedUserId}님이 ${relatedUserChallangeName} 챌린지에 답변을 달았습니다.`,
    }[notiType];
  }
}
