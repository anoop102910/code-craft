import { useProblems } from '@/services/problems.service';
import { Link } from 'react-router-dom';

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return 'text-green-500';
    case 'Medium':
      return 'text-yellow-500';
    case 'Hard':
      return 'text-red-500';
    default:
      return 'text-[var(--smash-depth-5)]';
  }
};

export const Problems = () => {

  const { problemsData, isLoading, error } = useProblems();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;  

  const problems = problemsData?.data || [];

  return (
    <div className="bg-[var(--smash-depth-2)] rounded-lg shadow-xl p-6">
      <h1 className="text-2xl font-bold text-[var(--smash-depth-10)] mb-6">Problems</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-[var(--smash-depth-4)]">
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--smash-depth-7)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--smash-depth-7)] uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--smash-depth-7)] uppercase tracking-wider">
                Difficulty
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--smash-depth-7)] uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--smash-depth-7)] uppercase tracking-wider">
                Acceptance
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--smash-depth-4)]">
            {problems.map((problem) => (
              <tr 
                key={problem.id}
                className="hover:bg-[var(--smash-depth-3)] transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* {problem.solved ? (
                    <span className="text-green-500">✓</span>
                  ) : (
                    <span className="text-gray-500">•</span>
                  )} */}
                  {
                    problem.status === "Solved" ? (
                      <span className="text-green-500">✓</span>
                    ) : (
                      <span className="text-gray-500">•</span>
                    )
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link 
                    to={`/problems/${problem.slug}`}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    {problem.title}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[var(--smash-depth-7)]">
                  {problem?.category?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-[var(--smash-depth-7)]">
                  {problem.acceptance.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 