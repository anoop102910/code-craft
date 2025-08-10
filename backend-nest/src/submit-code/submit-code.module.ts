import { Module } from '@nestjs/common';
import { SubmitCodeService } from './submit-code.service';
import { SubmitCodeController } from './submit-code.controller';
import { PrismaService } from '../prisma.service';
import { SqsService } from '../sqs.service';

@Module({
  providers: [SubmitCodeService, PrismaService, SqsService],
  controllers: [SubmitCodeController],
})
export class SubmitCodeModule {}
