import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Blocked, Report } from 'src/entities';
import { RelationModule } from 'src/relation/relation.module';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';

@Module({
  imports: [
    RelationModule,
    MikroOrmModule.forFeature([Report, Blocked])
  ],
  exports: [BlockService],
  providers: [BlockService],
  controllers: [BlockController],
})
export class BlockModule {}
