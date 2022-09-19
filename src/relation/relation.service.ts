import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Relation, User } from 'src/entities';
import { RelationStatus } from './relation-stautus.enum';

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

    async deleteRelation(objUser: User, subUserId: string) {
        const objUserRelation = await this.relationRepository.nativeDelete({
            object_user_id: objUser.id,
            subject_user_id: subUserId
        });
        const subUserRelation = await this.relationRepository.nativeDelete({
            object_user_id: subUserId,
            subject_user_id: objUser.id
        });
        this.relationRepository.flush();
        return;
    }
}
