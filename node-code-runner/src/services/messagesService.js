import {ReceiveMessageCommand, DeleteMessageCommand} from "@aws-sdk/client-sqs"
import { sqsClient } from "../config/sqs.js";

const queueUrl = "http://local-sqs:9324/queue/test";

export async function receiveMessages() {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 1,
  };

  try {
    const data = await sqsClient.send(new ReceiveMessageCommand(params));
    return data?.Messages;
  } catch (err) {
    console.error("Receive Error:", err);
    throw err;
  }
}

export async function deleteMessage(receiptHandle) {
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
