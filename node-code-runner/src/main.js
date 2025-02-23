import { runCode } from "./services/runCodeService.js";
import { deleteMessage, receiveMessages } from "./services/messagesService.js";
import { getUserCode, updateUserCode } from "./services/codeDbService.js";
import fs from "fs";
import { ExecutionError, TimeLimitExceeded } from "./utils/error.js";
import { getTestCases } from "./services/testCaseService.js";

const fsPromise = fs.promises;

const extension = {
  python: "py",
  java: "java",
  cpp: "cpp",
  javascript: "js",
  ruby: "rb",
  go: "go",
  csharp: "cs",
  php: "php",
};

async function main() {
  const messages = await receiveMessages();
  if (!messages) return;

  messages.forEach(async message => {
    const userCodeId = JSON.parse(message.Body).user_code_id;
    console.log(userCodeId);
    if (!userCodeId) return;
    const userCode = await getUserCode(userCodeId);
    console.log(userCode);

    const testCases = await getTestCases(userCode.problem_id);
    console.log(testCases);

    let fileName;
    try {
      fileName = `user_code-${userCode.id}.${extension[userCode.language]}`;
      console.log("filenaem", fileName);
      await fsPromise.writeFile(fileName, userCode.code);
    } catch (error) {
      console.log("failed to write file", error);
    }

    const codeMountPath = `${process.cwd()}${"\\"}${fileName}:/app/user_code.${
      extension[userCode.language]
    }`;
    console.log("codeMountPath: ", codeMountPath);

    try {
      const response = await runCode(testCases, codeMountPath, userCode.language);
      console.log(response);

      const dbResponse = await updateUserCode(
        userCode.id,
        response.c === testCases.length ? "accepted" : "wrong_answer",
        response.c,
        response.w,
        ""
      );
      console.log(dbResponse);
    } catch (error) {
      console.log(error);

      if (error instanceof TimeLimitExceeded) {
        console.log("TLE: ", error.message);
        updateUserCode(userCode.id, "time_limit_exceeded", 0, testCases.length, error.message);
      } else if (error instanceof ExecutionError) {
        console.log("ExecutionError", error.message);
        updateUserCode(userCode.id, "runtime_error", 0, testCases.length, error.message);
      }
    } finally {
      await deleteMessage(message.ReceiptHandle);
      try {
        await fsPromise.unlink(fileName);
        console.log(`File ${fileName} deleted successfully.`);
      } catch (error) {
        console.log(`Failed to delete file ${fileName}:`, error);
      }
    }
  });
}

const wait = delay =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(undefined);
    }, delay)
  );

while (true) {
  main();
  await wait(1000);
}
// const testCases = [
//   { input: "1\n2\n", output: "3\n" },
//   { input: "3\n4\n", output: "7\n" },
//   { input: "0\n0\n", output: "0\n" },
// ];
