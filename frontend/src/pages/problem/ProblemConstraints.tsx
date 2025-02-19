import { Problem } from '@/types';

interface ProblemConstraintsProps {
  problem: Problem;
}

export const ProblemConstraints = ({ problem }: ProblemConstraintsProps) => {
  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Constraints</h3>
      <ul className="list-disc pl-6">
        {Object.entries(problem.constraints).map(([key, value]) => (
          <li key={key} className="mb-2">
            {key}: {value}
          </li>
        ))}
      </ul>
    </div>
  );
}; 