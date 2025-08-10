import { Module } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { ProblemsController } from './problems.controller';
import { PrismaService } from '../prisma.service';
import { S3Service } from '../s3.service';

@Module({
  providers: [ProblemsService, PrismaService, S3Service],
  controllers: [ProblemsController],
})
export class ProblemsModule {}
