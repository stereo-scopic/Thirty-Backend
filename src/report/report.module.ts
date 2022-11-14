import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Blocked, Report } from 'src/entities';
import { RelationModule } from 'src/relation/relation.module';
import { ReportService } from './report.service';

@Module({
  imports: [
    RelationModule,
    MikroOrmModule.forFeature([Report, Blocked])
  ],
  exports: [ReportService],
  providers: [ReportService],
})
export class ReportModule {}
