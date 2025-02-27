import { SQSClient } from "@aws-sdk/client-sqs";


export const sqsClient = new SQSClient({
  region: "us-east-1",
  endpoint: "http://localhost:9324",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

