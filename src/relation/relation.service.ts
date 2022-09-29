import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Relation, User } from 'src/entities';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
import { NotificationType, getNotificationMessage } from 'src/notification/notification-type.enum';
import { NotificationService } from 'src/notification/notification.service';
import { CreateResponseRSVPDto } from './dto/create-resopnse-rsvp.dto';
import { RelationStatus } from './relation-stautus.enum';

@Injectable()
export class RelationService {
  constructor(
    @InjectRepository(Relation)
    private readonly relationRepository: EntityRepository<Relation>,
    private readonly notificationService: NotificationService
  ) {}

  async getRelationList(user: User): Promise<Relation[]> {
    return this.relationRepository.find({
      userId: user.id,
      status: RelationStatus.CONFIRMED,
    });
  }

  async getRelationCount(userId: string): Promise<number> {
    return this.relationRepository.count({
      userId: userId,
      status: RelationStatus.CONFIRMED,
    });
  }

  async sendRSVP(user: User, friendId: string): Promise<Relation> {
    const userId: string = user.id;
    const userOwnedRelation = new Relation(userId, friendId);
    const friendOwnedRelelation = new Relation(friendId, userId);
    this.relationRepository.persistAndFlush([
      userOwnedRelation,
      friendOwnedRelelation,
    ]);

    // Send Notification To Future Friend
    const createNotificationDto = new CreateNotificationDto(friendId, NotificationType.RELATION_RSVP, userId);
    this.notificationService.createNotification(createNotificationDto);

    return userOwnedRelation;
  }

  async responseRSVP(
    userId: string,
    createResponseRSVPDto: CreateResponseRSVPDto,
  ): Promise<void> {
    const { friendId, status } = createResponseRSVPDto;

    const usersComb = [
      { subject: userId, object: friendId },
      { subject: friendId, object: userId },
    ];
    usersComb.forEach(async (users) => {
      const relation = await this.getRelationByUsers(
        users.subject,
        users.object,
      );
      relation.status = status;
      this.relationRepository.persist(relation);
    });
    await this.relationRepository.flush();
  }

  async disconnect(userId: string, friendId: string): Promise<void> {
    const usersComb = [
      { subject: userId, object: friendId },
      { subject: friendId, object: userId },
    ];
    usersComb.forEach(async (users) => {
      const relation = await this.getRelationByUsers(
        users.subject,
        users.object,
      );
      this.relationRepository.remove(relation);
    });
    await this.relationRepository.flush();
  }

  private async getRelationByUsers(
    userId: string,
    friendId: string,
  ): Promise<Relation> {
    const relation = await this.relationRepository.findOne({
      userId: userId,
      friendId: friendId,
      status: RelationStatus.PENDING,
    });
    if (relation) return relation;
    throw new BadRequestException(`존재하지 않는 친구 신청입니다.`);
  }
}
