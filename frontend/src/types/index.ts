export interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

export interface Problem {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  acceptance: number;
  frequency: number;
  example_test_cases: TestCase[];
  constraints: {
    time_limit: string;
    memory_limit: string;
  };
  category: Category;
  status: string;
}

export interface TestCase {
  input: string;
  output: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export enum Language {
  JAVASCRIPT = "javascript",
  PYTHON = "python",
  JAVA = "java",
  CPP = "cpp",
}

export type SubmitCodeRequest = {
  code:string,
  language:string,
  problem: number
}

export type UserCodeResponse = {
  id: number;
  code: string;
  language: string;
  problem: number;
  status: string;
  correct_cases: number;
  incorrect_cases: number;
  execution_time: number;
  memory_used: number;
  result: "accepted" | "wrong_answer" | "time_limit_exceeded" | "memory_limit_exceeded" | "runtime_error";
  error_message: string;
  submission_time: string;
}

export type Response<T> = {
  status: string;
  data: T;
};

export type LoginResponse = User & { refresh: string; access: string };

export type UserResponse = Response<User>;

export type ProblemsResponse = Response<Problem[]>;

export type ProblemResponse = Response<Problem>;

export type ProblemRequest = Omit<Problem, "id" | "slug" | "solved">;
