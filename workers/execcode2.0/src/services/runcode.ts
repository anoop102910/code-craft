import child_process from "child_process";
import { ExecutionError, TimeLimitExceeded } from "../utils/error.js";
import { DockerPool } from "./dockerpool.js";

export const runner: Record<string, string> = {
  python: "python_runner",
  js: "js_runner",
  cpp: "cpp_runner",
  java: "java_runner"
};

const getCommand = (fileName: string): Record<string, string[]> => {
  return {
    python: ["python3", "/app/codes/" + fileName],
    java: [
      "javac",
      "/app/codes/" + fileName,
      "&&",
      "java",
      "-cp",
      "/app",
      fileName.replace(".java", ""),
    ],
    cpp: [
      "g++",
      "/app/codes/" + fileName,
      "-o",
      "/app/codes/" + fileName,
      "&&",
      "/app/codes/"+ fileName,
    ],
    javascript: ["node", "/app/codes/" + fileName],
    ruby: ["ruby", "/app/codes/" + fileName],
    go: ["go", "run", "/app/codes/" + fileName],
    csharp: [
      "dotnet",
      "build",
      "/app/codes/" + fileName.replace(".csproj", ""),
      "&&",
      "dotnet",
      "run",
      "--project",
      "/app/codes/" + fileName.replace(".csproj", ""),
    ],
    php: ["php", "/app/codes/" + fileName],
  };
};

interface TestCase {
  input: string;
  output: string;
}

interface CodeResponse {
  c: number;
  w: number;
}

export class RunCodeService {
  dockerpool;
  constructor(dockerpool: DockerPool) {
    console.log("RunCodeService registered");
    this.dockerpool = dockerpool;
  }

  private result(data: string, testCases: TestCase[]) {
    const exp_outputs = data
      // .toString("utf-8")
      .trim()
      .split("\n")
      .filter(output => output.length > 0);
    console.log(exp_outputs);
    if (exp_outputs.length != testCases.length) {
      return { c: 0, w: testCases.length };
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
  }

  runCode = (testCases: TestCase[], fileName: string, lang: string): Promise<CodeResponse> =>
    new Promise((resolve, reject) => {
      const dockerProcess = this.dockerpool.getDockerPool(lang);
      if (!dockerProcess) return;

      const command = ["exec",'-i', dockerProcess.id, ...getCommand(fileName)[lang]];
      console.log(command)
      
      const child = child_process.spawn("docker", command);

      let fullOutput = "";

      child.stdout.on("data", data => {
        fullOutput += data.toString("utf-8");
      });

      child.stderr.on("data", data => {
        console.log(data.toString("utf-8"))
        reject(new ExecutionError(data.toString("utf-8")));
      });

      child.on("exit", (code, signal) => {
        if (signal == "SIGTERM") return reject(new TimeLimitExceeded("TIME LIMIT EXCEEDED"));
        /* if (code !== 0) {
          return reject(new ExecutionError(stderrData || "Unknown Execution Error"));
        } */

        this.dockerpool.returnDockerProcess(dockerProcess,lang)  
        resolve(this.result(fullOutput, testCases));
      });

      child.stdin.write(`${testCases.length}\n`);

      const combinedInputs = testCases.map(testCase => testCase.input).join("");
      child.stdin.write(combinedInputs);

      child.stdin.end();
    });
}
