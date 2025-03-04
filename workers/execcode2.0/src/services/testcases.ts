import { GetObjectCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3.js";
import { Readable } from "stream";
import internal from 'stream';

export class TestCaseService {
  constructor() {
    console.log('TestCaseService registered')
  }
  async getTestCases(problemId: string) {
    const params = {
      Bucket: "test",
      Key: `problem-id-${problemId}.txt`,
    };

    try {
      const data = await s3Client.send(new GetObjectCommand(params));
      if (!data.Body || !(data.Body instanceof internal.Readable)) {
        throw new Error("Invalid or missing response body from S3");
      }
      const stringData = await this.streamToString(data.Body);
      return this.modifyTestCases(stringData);
    } catch (err: any) {
      console.error("Error retrieving test cases:", err.message);
      throw err;
    }
  }

  modifyTestCases(testCasesContent: string) {
    const testCases = [];
    const lines = testCasesContent
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    for (let i = 0; i < lines.length; i += 2) {
      const testCase = { input: "", output: "" };
      testCase.input = lines[i].replace(" ", "\n") + "\n";
      if (i + 1 < lines.length) {
        testCase.output = lines[i + 1].replace(" ", "\n");
      }
      testCases.push(testCase);
    }

    return testCases;
  }

  private async streamToString(stream: Readable): Promise<string> {
    const chucks = [];
    for await (const chunk of stream) {
      chucks.push(chunk);
    }
    return Buffer.concat(chucks).toString("utf-8");
  }

  async getFile(bucketName: string, fileName: string) {
    const params = {
      Bucket: bucketName,
      Key: fileName,
    };

    try {
      const data = await s3Client.send(new GetObjectCommand(params));
      if (!data.Body || !(data.Body instanceof internal.Readable)) {
        throw new Error("Invalid or missing response body from S3");
      }
      const response = this.streamToString(data.Body);
      // console.log(response);
    } catch (err: any) {
      console.error(`Error retrieving file: ${err.message}`); // Enhanced logging
      throw err;
    }
  }

  async listBuckets() {
    try {
      const data = await s3Client.send(new ListBucketsCommand({}));
     /*  console.log(
        "Bucket names:",
        data.Buckets?.map(bucket => bucket.Name)
      ); */
      return data.Buckets;
    } catch (err: any) {
      console.error("Error listing buckets:", err.message);
      throw err;
    }
  }
}
