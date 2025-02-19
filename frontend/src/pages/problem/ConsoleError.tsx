import React from 'react';

interface ConsoleErrorProps {
  error: string | null;
}

export const ConsoleError: React.FC<ConsoleErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className=" text-white p-4 rounded">
      <h2 className="font-bold">Error</h2>
      <pre className='text-red-400 whitespace-pre-wrap'>{error}</pre>
    </div>
  );
};
