import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Relation, User } from 'src/entities';
import { CreateResponseRSVPDto } from './dto/create-resopnse-rsvp.dto';
import { RelationStatus } from './relation-stautus.enum';

@Injectable()
export class RelationService {
  constructor(
    @InjectRepository(Relation)
    private readonly relationRepository: EntityRepository<Relation>,
  ) {}

  async getRelationList(user: User): Promise<Relation[]> {
    return this.relationRepository.find({
      subjectUserId: user.id,
      status: RelationStatus.CONFIRMED,
    });
  }

  async getRelationCount(userId: string): Promise<number> {
    return this.relationRepository.count({
      subjectUserId: userId,
      status: RelationStatus.CONFIRMED,
    });
  }

  async sendRSVP(user: User, objectUserId: string): Promise<Relation> {
    const subjectUserId: string = user.id;
    const userOwnedRelation = new Relation(subjectUserId, objectUserId);
    const friendOwnedRelelation = new Relation(objectUserId, subjectUserId);
    this.relationRepository.persistAndFlush([
      userOwnedRelation,
      friendOwnedRelelation,
    ]);
    return userOwnedRelation;
  }

  async responseRSVP(
    subjectUserId: string,
    createResponseRSVPDto: CreateResponseRSVPDto,
  ): Promise<void> {
    const { friendId, status } = createResponseRSVPDto;

    const usersComb = [
      { subject: subjectUserId, object: friendId },
      { subject: friendId, object: subjectUserId },
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

  async disconnect(subjectUserId: string, objectUserId: string): Promise<void> {
    const usersComb = [
      { subject: subjectUserId, object: objectUserId },
      { subject: objectUserId, object: subjectUserId },
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
    subjectUserId: string,
    objectUserId: string,
  ): Promise<Relation> {
    const relation = await this.relationRepository.findOne({
      subjectUserId: subjectUserId,
      objectUserId: objectUserId,
      status: RelationStatus.PENDING,
    });
    if (relation) return relation;
    throw new BadRequestException(`존재하지 않는 친구 신청입니다.`);
  }
}
