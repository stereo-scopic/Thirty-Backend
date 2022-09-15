import { Module } from '@nestjs/common';
import { RelationService } from './relation.service';
import { RelationController } from './relation.controller';

@Module({
  providers: [RelationService],
  controllers: [RelationController]
})
export class RelationModule {}
