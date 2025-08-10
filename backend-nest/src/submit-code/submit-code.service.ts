import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SubmitCodeDto } from './dto/submit-code.dto';
import { SqsService } from '../sqs.service';

@Injectable()
export class SubmitCodeService {
  constructor(private prisma: PrismaService, private sqs: SqsService) {}

  async submitCode(submitCodeDto: SubmitCodeDto, userId: number) {
    const userCode = await this.prisma.userCode.create({
      data: {
        ...submitCodeDto,
        userId,
      },
    });

    await this.sqs.sendMessage(JSON.stringify({ user_code_id: userCode.id }));

    return {
      message: 'Code pushed to the queue',
      user_code_id: userCode.id,
    };
  }

  async getUserSubmissions(userId: number) {
    return this.prisma.userCode.findMany({
      where: { userId },
    });
  }

  async getAllSubmissions() {
    return this.prisma.userCode.findMany();
  }
}
