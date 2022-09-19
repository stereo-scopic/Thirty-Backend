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
        private readonly relationRepository: EntityRepository<Relation>
    ) {}

    async getRelationList(user: User): Promise<Relation[]> {
        return this.relationRepository.find({ 
            object_user_id: user.id,
            status: RelationStatus.CONFIRMED
         });
    }

    async getRelationCount(userId: string): Promise<number> {
        return this.relationRepository.count({
            subject_user_id: userId,
            status: RelationStatus.CONFIRMED
        });
    }

    async sendRSVP(objUser: User, subUserId: string): Promise<Relation> {
        const subRelation = new Relation(objUser.id, subUserId);
        const objRelelation = new Relation(subUserId, objUser.id);
        this.relationRepository.persistAndFlush([subRelation, objRelelation]);
        return subRelation;
    }

    async responseRSVP(subUserId: string, createResponseRSVPDto: CreateResponseRSVPDto): Promise<Relation[]> {
        const { object_user_id, status } = createResponseRSVPDto;
        const users: IRelationPK[] = [
            { subject_user_id: subUserId, object_user_id }, 
            { object_user_id, subject_user_id: subUserId }
        ];
        return Promise.all(
            users.map(async (user: IRelationPK) => {
                const relation = await this.getRelationByUsers(user);
                relation.status = status;
                return relation
            })
        )
    }

    async disconnect(objUser: User, subUserId: string): Promise<void> {
        await this.relationRepository.nativeDelete({
            object_user_id: objUser.id,
            subject_user_id: subUserId
        });
        await this.relationRepository.nativeDelete({
            object_user_id: subUserId,
            subject_user_id: objUser.id
        });
        await this.relationRepository.flush();
    }

    private async getRelationByUsers(users: IRelationPK): Promise<Relation> {
        const relation = await this.relationRepository.findOne(users)
        if (relation) return relation;
        throw new BadRequestException(`존재하지 않는 친구 신청입니다.`);
    }
}
