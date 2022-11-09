import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Blocked } from 'src/entities';

@Module({
  imports: [MikroOrmModule.forFeature([Blocked])],
  providers: [ReportService],
  controllers: [ReportController]
})
export class ReportModule {}
