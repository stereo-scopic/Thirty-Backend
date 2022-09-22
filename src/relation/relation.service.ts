import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Relation, User } from 'src/entities';
import { CreateResponseRSVPDto } from './dto/create-resopnse-rsvp.dto';
import { RelationStatus } from './relation-stautus.enum';
import { IRelationPK } from './relation.inerface';

@Injectable()
export class RelationService {
  constructor(
    @InjectRepository(Relation)
    private readonly relationRepository: EntityRepository<Relation>,
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
    return userOwnedRelation;
  }

  async responseRSVP(
    userId: string,
    createResponseRSVPDto: CreateResponseRSVPDto,
  ): Promise<void> {
    const { friendId, status } = createResponseRSVPDto;
    const users: IRelationPK[] = [
      { userId, friendId },
      { friendId, userId },
    ];
    Promise.all(
      users.map(async (user: IRelationPK) => {
        const relation = await this.getRelationByUsers(user);
        relation.status = status;
        return relation;
      }),
    );
  }

  async disconnect(objUser: User, subUserId: string): Promise<void> {
    await this.relationRepository.nativeDelete({
      friendId: objUser.id,
      userId: subUserId,
    });
    await this.relationRepository.nativeDelete({
      friendId: subUserId,
      userId: objUser.id,
    });
    await this.relationRepository.flush();
  }

  private async getRelationByUsers(users: IRelationPK): Promise<Relation> {
    const relation = await this.relationRepository.findOne(users);
    if (relation) return relation;
    throw new BadRequestException(`존재하지 않는 친구 신청입니다.`);
  }
}
