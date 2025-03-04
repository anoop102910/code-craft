import * as child_process from "child_process";
import { randomUUID } from "crypto";
import { runner } from "./runcode";

let dockerPoolClass: DockerPool;

export class DockerPool {
  private dockerPool: Record<string, { id: string; pid: number }[]> = {
    python: [],
    js: [],
    cpp: [],
    java: []
  };
  private dockerPoolAll: { id: string; pid: number }[] = [];

  constructor() {
    console.log("Dockerpool registered");
    if (dockerPoolClass) return dockerPoolClass;
  }

  async initializeDockerPool(limit: number): Promise<void> {
    console.log("Dockerpool initialized");
    await this.createDockerPool({ limit });
    dockerPoolClass = this;
  }

  private createDockerContainer = (
    id: string,
    dockerImage: string,
    lang: string
  ): Promise<{ id: string; pid: number; lang: string }> => {
    return new Promise((resolve, reject) => {
      console.log("creating new docker container");
      const dockerProcess = child_process.spawn("docker", [
        "run",
        "-d",
        "-v",
        `${process.cwd()}/src/codes:/app/codes`,
        "--name",
        id,
        dockerImage,
        "sleep",
        "infinity",
      ]);

      let output = "";

      dockerProcess.stdout.on("data", data => {
        output += data.toString();
      });

      dockerProcess.stderr.on("data", data => {
        console.error(`Docker stderr: ${data}`);
      });

      dockerProcess.on("close", code => {
        if (code === 0) {
          const containerId = output.trim();
          console.log("docker container created with ID:", containerId);
          resolve({ id, pid: dockerProcess.pid || 0, lang });
        } else {
          reject(new Error(`Docker container creation failed with code ${code}`));
        }
      });

      dockerProcess.on("error", error => {
        console.log("Failed to create docker container", error);
        reject(error);
      });
    });
  };

  private async createDockerPool({ limit }: { limit: number }) {
    const promises: Promise<{ id: string; pid: number; lang: string }>[] = [];

    Object.entries(runner).map(([lang, runner]) => {
      for (let i = 0; i < limit; i++) {
        const id = randomUUID();
        promises.push(this.createDockerContainer(id, runner, lang));
      }
    });

    const results = await Promise.all(promises);
    results.map(result => {
      this.dockerPool[result.lang].push({...result});
    });
    this.dockerPoolAll.push(...results);
  }

  getDockerPool(lang: string) {
    console.log("getDockerPool");
    return this.dockerPool[lang].length > 0 ? this.dockerPool[lang].pop() : null;
  }

  returnDockerProcess(process: { id: string; pid: number }, lang: string) {
    this.dockerPool[lang].push(process);
  }

  async removeAllContainers() {
    const promises = this.dockerPoolAll.map(container => {
      return new Promise((resolve, reject) => {
        child_process.exec(`docker rm -f ${container.id}`, error => {
          if (error) console.log("Error remove docker container", error);
          else {
            console.log("docker container removed", container.id);
          }
          resolve(undefined);
        });
      });
    });
    await Promise.all(promises);
  }
}
