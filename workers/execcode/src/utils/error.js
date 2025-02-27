export class ResultFailedError extends Error {
    constructor(message, code) {
      super(message);
      this.code = code;
    }
  }
  
export class ExecutionError extends Error {
    constructor(message) {
      super(message);
    }
  }

  export class TimeLimitExceeded extends Error {
      constructor(message = "Time limit exceeded") {
          super(message);
          this.name = "TimeLimitExceeded";
      }
  }
