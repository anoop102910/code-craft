import { S3Client, PutObjectCommand, GetObjectCommand, ListBucketsCommand } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
//   region: "us-east-1",
  endpoint: "http://localhost:9000",
  forcePathStyle: true,
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test1234",
  },
});

