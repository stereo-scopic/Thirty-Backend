import { QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Notification, User } from 'src/entities';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationType } from './notification-type.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: EntityRepository<Notification>,
  ) {}

  async getNotificationList(user: User): Promise<Notification[]> {
    return this.notificationRepository.find(
      { user_id: user.id },
      { orderBy: { created_at: QueryOrder.ASC } },
    );
  }

  async checkReadNotification(
    user: User,
    notificationId: number,
  ): Promise<void> {
    const notification = await this.getNotificationById(notificationId);
    if (!(await this.isNotificationOwner(user, notification))) {
      throw new ForbiddenException(`권한이 없습니다.`);
    }

    notification.is_read = true;
    this.notificationRepository.persist(notification);
  }

  private async getNotificationById(
    notificationId: number,
  ): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      id: notificationId,
    });
    if (notification) {
      return notification;
    }
    throw new BadRequestException(`존재하지 않는 알림입니다.`);
  }

  private async isNotificationOwner(
    user: User,
    notification: Notification,
  ): Promise<boolean> {
    if (user.id === notification.user_id) {
      return true;
    }
    return false;
  }
}
