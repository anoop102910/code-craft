import { Injectable } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

@Injectable()
export class SqsService {
  private readonly sqs: SQSClient;
  private readonly queueUrl: string;

  constructor() {
    this.sqs = new SQSClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.queueUrl = process.env.SQS_QUEUE_URL;
  }

  async sendMessage(messageBody: string) {
    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: messageBody,
    });

    try {
      const response = await this.sqs.send(command);
      return response;
    } catch (error) {
      console.error('Error sending message to SQS:', error);
      throw error;
    }
  }
}
