import { runCode } from "../services/runcode.js";
import { modifyTestCases } from "../services/testcases.js";
import fs from 'fs';
const fsPromise = fs.promises;

const language = "python";
const fileName = "user_code.py";
const codeMountPath = `${process.cwd()}${"\\"}${fileName}:/app/user_code.${"py"}`;

const main = async (modifiedTestCases) => {
    const start = process.hrtime();
    const result = await runCode(modifiedTestCases, codeMountPath, language);
    const end = process.hrtime(start);
    console.log(`Time taken: ${end[0]} seconds and ${end[1] / 1000000} milliseconds`);
    return end[0];
};

const runCode10Times = async (modifiedTestCases) => {
    // Running all 50 executions in parallel, ensuring they all start at the same time
    const results = await Promise.all(
        Array(30).fill(0).map(() => main(modifiedTestCases))
    );
    return results;
};

const run = async () => {
    // Read the test cases once
    const testCases = await fsPromise.readFile("./testcases.txt", "utf-8");
    const modifiedTestCases = modifyTestCases(testCases);

    const totalTime = await runCode10Times(modifiedTestCases);

    console.log(`Total time for 50 runs: ${totalTime.reduce((acc, curr) => acc + curr, 0)} seconds`);
};

run();
