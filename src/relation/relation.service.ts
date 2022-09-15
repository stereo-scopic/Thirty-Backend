import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Relation, RelationStatus, User } from 'src/entities';

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
}
