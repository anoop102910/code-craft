import { ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "../config/sqs.js";

const queueUrl = "http://local-sqs:9324/queue/test";

export class MessageService{

  constructor(){
    console.log("MessageService registered")

  }

  async receiveMessages({ limit, wait }: { limit: number; wait: number }) {
    const params = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: limit,
      WaitTimeSeconds: wait,
    };
  
    try {
      const data = await sqsClient.send(new ReceiveMessageCommand(params));
      return data?.Messages;
    } catch (err) {
      console.error("Receive Error:", err);
      throw err;
    }
  }
  
  async deleteMessage(receiptHandle: string) {
    const params = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    };
  
    try {
      await sqsClient.send(new DeleteMessageCommand(params));
      console.log("Message Deleted!");
    } catch (err) {
      console.error("Delete Error:", err);
    }
  }
  
}

