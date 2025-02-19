import { Problem } from '@/types';

interface ProblemExamplesProps {
  problem: Problem;
}

export const ProblemExamples = ({ problem }: ProblemExamplesProps) => {
  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Examples</h3>
      {problem.example_test_cases.map((example, index) => (
        <div key={index} className="mb-6">
          <h4 className="font-medium mb-2">Example {index + 1}:</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-2">
              <span className="font-medium">Input: </span>
              <code>{example.input}</code>
            </div>
            <div className="mb-2">
              <span className="font-medium">Output: </span>
              <code>{example.output}</code>
            </div>
            {/* {example.explanation && (
              <div>
                <span className="font-medium">Explanation: </span>
                <span>{example.explanation}</span>
              </div>
            )} */}
          </div>
        </div>
      ))}
    </div>
  );
}; 