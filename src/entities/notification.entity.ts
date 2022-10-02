import { Entity, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
import {
  NotificationType,
  NotificationTypeCode,
} from 'src/notification/notification-type.enum';
import { BaseEntity } from './BaseEntity';
import { User } from './user.entity';

@Entity()
export class Notification extends BaseEntity {
  @ApiProperty({
    example: `adfa8b368bcd91d3d830`,
    description: `user unique id`,
    type: 'string',
  })
  @Property({ hidden: true })
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
    enum: NotificationTypeCode,
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

  constructor(createNotificationDto: CreateNotificationDto<User>) {
    super();
    const { user, type, relatedUser, sourceName, sourceId } =
      createNotificationDto;
    this.user_id = user.id;
    this.type = type;
    this.message = this.getNotificationMessage(type, relatedUser.nickname);

    if (relatedUser) {
      this.related_user_id = relatedUser.id;
    }
    if (sourceName && sourceId) {
      this.related_source_name = sourceName;
      this.related_source_id = sourceId;
    }
  }

  setNotificationMessage(
    notiType: NotificationType,
    relatedUserNickeName?: string,
  ) {
    this.message = this.getNotificationMessage(notiType, relatedUserNickeName);
  }

  private getNotificationMessage(
    notiType: NotificationType,
    relatedUserNickname?: string,
    relatedUserChallangeName?: string,
  ) {
    return {
      RR0: `${relatedUserNickname}님이 친구 신청을 했어요.`,
      RR1: `${relatedUserNickname}님의 친구 신청을 수락했어요.`,
      RR2: `${relatedUserNickname}님의 친구 신청을 거절했어요.`,
      RC0: `${relatedUserNickname}님이 회원님의 친구 신청을 수락했어요.`,
      BC0: `${relatedUserNickname}님이 '${relatedUserChallangeName}' 챌린지를 성공했어요!`,
      BA0: `${relatedUserNickname}님이 '${relatedUserChallangeName}' 답변을 작성했어요.`,
    }[notiType];
  }
}
