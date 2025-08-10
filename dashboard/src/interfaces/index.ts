export interface IProblem {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  acceptance: number;
  frequency: number;
  example_test_cases: JSON;
  all_test_cases: JSON;
  constraints: JSON;
  status: string;
  time_limit: number;
  memory_limit: number;
  categoryId: number;
}
