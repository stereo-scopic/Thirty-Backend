import { Module } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationController } from './relation.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Relation } from 'src/entities';

@Module({
  imports: [MikroOrmModule.forFeature([Relation])],
  exports: [RelationService],
  providers: [RelationService],
  controllers: [RelationController],
})
export class RelationModule {}
