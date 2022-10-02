import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Relation, User, Notification } from 'src/entities';
import { NotificationTypeCode } from 'src/notification/notification-type.enum';
import { NotificationService } from 'src/notification/notification.service';
import { CreateResponseRSVPDto } from './dto/create-resopnse-rsvp.dto';
import { RelationStatus } from './relation-stautus.enum';

@Injectable()
export class RelationService {
  constructor(
    @InjectRepository(Relation)
    private readonly relationRepository: EntityRepository<Relation>,
    private readonly notificationService: NotificationService,
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
    if (userId === friendId) {
      throw new BadRequestException(
        `옳지 못한 요청입니다: 요청 유저 ID와 친구 신청 유저 ID 동일.`,
      );
    }
    const userOwnedRelation = new Relation(userId, friendId);
    const friendOwnedRelelation = new Relation(friendId, userId);
    try {
      await this.relationRepository.persistAndFlush([
        userOwnedRelation,
        friendOwnedRelelation,
      ]);
    } catch (error) {
      // duplicate unique key
      if (error.code == 23505) {
        throw new BadRequestException(`이미 친구 관계입니다.`);
      }
    }

    // Send Notification To Future Friend
    this.notificationService.createNotification({
      user: friendId,
      type: NotificationTypeCode.RELATION_RSVP,
      relatedUser: userId,
    });

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

    // Send Notification
    if (status === RelationStatus.CONFIRMED) {
      // Change My Notification To Relation_Confirmend
      this.notificationService.updateNotification(
        userId,
        friendId,
        NotificationTypeCode.RELATION_RSVP_CONFIRMED,
      );
      // Send Relation_RSVP_Confirmed to Friend Notification
      this.notificationService.createNotification({
        user: friendId,
        relatedUser: userId,
        type: NotificationTypeCode.RELATION_CONFIRMED,
      });
    } else {
      this.notificationService.updateNotification(
        userId,
        friendId,
        NotificationTypeCode.RELATION_RSVP_DENIED,
      );
    }
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
