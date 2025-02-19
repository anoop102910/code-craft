interface TestResultsProps {
  results: {
    correct_cases: number;
    incorrect_cases: number;
    result: boolean;
  };
} 

export const TestResults = ({ results }: TestResultsProps) => {
  const total = results.correct_cases + results.incorrect_cases;
  const passPercentage = (results.correct_cases / total) * 100;

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4 text-white">Test Results</h3>
      <div className={`mb-4 p-3 rounded-lg text-center font-semibold ${
        results.result ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
      }`}>
        {results.result ? 'All Test Cases Passed!' : 'Some Test Cases Failed'}
      </div>
      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white">Passed:</span>
          <span className="text-green-400">{results.correct_cases}/{total} tests</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-green-400 h-2.5 rounded-full" 
            style={{ width: `${passPercentage}%` }}
          ></div>
        </div>
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-white">Passed: {results.correct_cases}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-white">Failed: {results.incorrect_cases}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 