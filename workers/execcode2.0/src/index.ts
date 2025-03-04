import { RunCodeService } from "./services/runcode.js";
import { MessageService } from "./services/message.js";
import { DBService } from "./services/dbcode.js";
import fs from "fs";
import { ExecutionError, TimeLimitExceeded } from "./utils/error.js";
import { TestCaseService } from "./services/testcases.js";
import type { Message } from "@aws-sdk/client-sqs";
import { DockerPool } from "./services/dockerpool.js";

const fsPromise = fs.promises;

const extension: Record<string, string> = {
  python: "py",
  java: "java",
  cpp: "cpp",
  javascript: "js",
  ruby: "rb",
  go: "go",
  csharp: "cs",
  php: "php",
};

class Consumer {
  testCaseService;
  messageService;
  runCodeService;
  dbService;
  dockerPool;

  constructor() {
    this.testCaseService = new TestCaseService();
    this.messageService = new MessageService();
    this.dockerPool = new DockerPool();
    this.runCodeService = new RunCodeService(this.dockerPool);
    this.dbService = new DBService();
  }

  async start() {
    await this.dockerPool.initializeDockerPool(4);

    process.on("SIGINT", async () => {
      console.log("receied sigint");
      await this.dockerPool.removeAllContainers();
      process.exit(0);
    });

    while (true) {
      console.count();
      await this.main();
    }
  }

  async main() {
    const messages = await this.messageService.receiveMessages({ limit: 10, wait: 1 });

    if (!messages) return;

    Promise.all(messages.map(message => this.handleMessage(message)));
  }

  async handleMessage(message: Message) {
    if (!message.Body) return;

    const userCodeId = JSON.parse(message.Body).user_code_id;
    console.log(userCodeId);

    if (!userCodeId) return;

    const userCode = await this.dbService.getUserCode(userCodeId);
    console.log(userCode);

    const testCases = await this.testCaseService.getTestCases(userCode.problem_id);
    // console.log(testCases);

    const fileName = `user-code-${userCode.id}.${extension[userCode.language]}`;

    const filePath = `${process.cwd()}/src/codes/${fileName}`;
    await fsPromise.writeFile(filePath, userCode.code);

    console.log("File written to ", filePath);

    try {
      const response = await this.runCodeService.runCode(testCases, fileName, userCode.language);
      console.log(response);

      await this.dbService.updateUserCode(
        userCode.id,
        response.c === testCases.length ? "accepted" : "wrong_answer",
        response.c,
        response.w,
        ""
      );
    } catch (error) {
      console.log(error);

      if (error instanceof TimeLimitExceeded) {
        console.log("TLE: ", error.message);
        this.dbService.updateUserCode(
          userCode.id,
          "time_limit_exceeded",
          0,
          testCases.length,
          error.message
        );
      } else if (error instanceof ExecutionError) {
        console.log("ExecutionError", error.message);
        this.dbService.updateUserCode(
          userCode.id,
          "runtime_error",
          0,
          testCases.length,
          error.message
        );
      }
    } finally {
      await this.messageService.deleteMessage(message.ReceiptHandle!);
      try {
        await fsPromise.unlink(filePath);
        console.log(`File ${fileName} deleted successfully.`);
      } catch (error) {
        console.log(`Failed to delete file ${fileName}:`, error);
      }
    }
  }
}

const consumer = new Consumer();
consumer.start();
// const testCases = [
//   { input: "1\n2\n", output: "3\n" },
//   { input: "3\n4\n", output: "7\n" },
//   { input: "0\n0\n", output: "0\n" },
// ];
