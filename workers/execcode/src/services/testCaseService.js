import { GetObjectCommand, ListBucketsCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3.js";

export const getTestCases = async problemId => {
  const params = {
    Bucket: "test",
    Key: `problem-id-${problemId}.txt`,
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(params));
    const stringData = await streamToString(data.Body);
    return modifyTestCases(stringData)
  } catch (err) {
    console.error("Error retrieving test cases:", err.message); // Enhanced logging
    throw err;
  }
};


export function modifyTestCases(testCasesContent) {
    const testCases = [];
    const lines = testCasesContent
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);
  
    for (let i = 0; i < lines.length; i += 2) {
      const testCase = {};
      testCase.input = lines[i].replace(" ", "\n") + "\n";
      if (i + 1 < lines.length) {
        testCase.output = lines[i + 1].replace(" ", "\n");
      }
      testCases.push(testCase);
    }
  
    return testCases;
  }
  

const streamToString = async stream => {
  const chucks = [];
  for await (const chunk of stream) {
    chucks.push(chunk);
  }
  return Buffer.concat(chucks).toString("utf-8");
};

export const getFile = async (bucketName, fileName) => {
  const params = {
    Bucket: bucketName,
    Key: fileName,
  };

  try {
    const data = await s3Client.send(new GetObjectCommand(params));
    const response = streamToString(data.Body);
    console.log(response);
  } catch (err) {
    console.error("Error retrieving file:", err.message); // Enhanced logging
    throw err;
  }
};

export const listBuckets = async () => {
  try {
    const data = await s3Client.send(new ListBucketsCommand({}));
    console.log(
      "Bucket names:",
      data.Buckets.map(bucket => bucket.Name)
    );
    return data.Buckets;
  } catch (err) {
    console.error("Error listing buckets:", err.message);
    throw err;
  }
};
