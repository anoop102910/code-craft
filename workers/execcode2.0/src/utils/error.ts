export class ResultFailedError extends Error {
  code;
  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

export class ExecutionError extends Error {
  constructor(message:string) {
    super(message);
  }
}

export class TimeLimitExceeded extends Error {
  constructor(message = "Time limit exceeded") {
    super(message);
    this.name = "TimeLimitExceeded";
  }
}
