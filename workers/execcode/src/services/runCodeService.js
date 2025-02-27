import child_process from "child_process";
import { ExecutionError, TimeLimitExceeded } from "../utils/error.js";

const runner = {
  python: "python_runner",
  java: "java_runner",
  cpp: "cpp_runner",
};

const result = (data, testCases) => {
  const exp_outputs = data
    // .toString("utf-8")
    .trim()
    .split("\n")
    .filter(output => output.length > 0);
  // console.log(exp_outputs);
  if (exp_outputs.length != testCases.length) {
    return { c: 0, w: testCases.length }
  }

  let c = 0,
    w = 0;
  exp_outputs.forEach((exp_output, index) => {
    if (exp_output.trim() != testCases[index]?.output.trim()) {
      w++;
    } else {
      c++;
    }
  });
  return { c, w };
};

export const runCode = (testCases, codeMountPath, language) =>
  new Promise((resolve, reject) => {
    const child = child_process.spawn("docker", [
      "run",
      "--rm",
      "-i",
      "-m","20mb",
      "-v",
      codeMountPath,
      runner[language],
      "timeout",
      "10s",
    ]);

    // console.log(child.pid);

    let fullOutput = "";

    child.stdout.on("data", data => {
      fullOutput+=data.toString('utf-8')
    });

    child.stderr.on("data", data => {
      reject(new ExecutionError(data.toString("utf-8")));
    });

    child.on("exit", (code, signal) => {
      if (signal == "SIGTERM") return reject(new TimeLimitExceeded("TIME LIMIT EXCEEDED"));
      /* if (code !== 0) {
        return reject(new ExecutionError(stderrData || "Unknown Execution Error"));
      } */
      
      resolve(result(fullOutput,testCases))
    });

    child.stdin.write(`${testCases.length}\n`);

    const combinedInputs = testCases.map(testCase => testCase.input).join("");
    child.stdin.write(combinedInputs);

    child.stdin.end();

    /*  setTimeout(() => {
      console.log('settimeout getting called', child.pid)
      if(child){
        console.log('child exists')
      }
      else {
        console.log('child not exists')
      }
      child.kill();
    }, 10000); */
  });
