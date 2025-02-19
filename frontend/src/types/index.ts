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
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  JAVA = 'java',
  CPP = 'cpp',
}

export type Response<T> = {
  status: string;
  data: T;
}

export type LoginResponse = Response<User & { token: string }>;

export type UserResponse = Response<User>;

export type ProblemsResponse = Response<Problem[]>;

export type ProblemResponse = Response<Problem>;

export type ProblemRequest = Omit<Problem, 'id' | 'slug' | 'solved'>;

