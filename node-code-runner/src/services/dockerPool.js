import child_process from "child_process";
import { runner } from "./runCodeService";

const LIMIT = 10;
const dockerQueue = {
  python: [],
};

export const createContainer = (runner) => {
  return child_process.spawn("docker", [
    "run",
    "-d",
    "-i",
    "-m",
    "20mb",
    runner,
  ]);
};

Object.entries((lang, runner) => {
  for (let i = 0; i < LIMIT; i++) {
    const dockerProcess = createContainer(runner);
    dockerQueue[lang].push(dockerProcess);
  }
});

export const getDockerContainer = lang => {
  if (dockerQueue.length > 0) return dockerQueue[lang].pop();
  else return null;
};
