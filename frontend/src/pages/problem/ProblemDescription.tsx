import { Problem } from "@/types";


interface ProblemDescriptionProps {
  problem: Problem;
}

export const ProblemDescription = ({ problem }: ProblemDescriptionProps) => {
  return (
    <div className="space-y-6 text-[var(--smash-depth-10)]">
      <div>
        <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
        <div className="flex gap-4 text-sm">
          <span className={`font-medium ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          <span className="text-[var(--smash-depth-7)]">Acceptance: {problem.acceptance}%</span>
          <span className="text-[var(--smash-depth-7)]">Frequency: {problem.frequency}%</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-[var(--smash-depth-7)]">{problem.description}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Example Test Cases</h2>
          <div className="space-y-4">
            {problem.example_test_cases.map((testCase, index) => (
              <div key={index} className="bg-[var(--smash-depth-3)] p-4 rounded-lg">
                <div className="mb-2">
                  <span className="font-medium">Input:</span> {testCase.input}
                </div>
                <div>
                  <span className="font-medium">Output:</span> {testCase.output}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Constraints</h2>
          <ul className="list-disc list-inside text-[var(--smash-depth-7)]">
            <li>Time Limit: {problem.constraints.time_limit}</li>
            <li>Memory Limit: {problem.constraints.memory_limit}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Category</h2>
          <div className="text-[var(--smash-depth-7)]">
            <p className="font-medium">{problem?.category?.name}</p>
            <p>{problem?.category?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'text-green-600';
    case 'medium':
      return 'text-yellow-600';
    case 'hard':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
}; 