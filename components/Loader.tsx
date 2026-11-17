
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-sm text-gray-600">Analisando seu histórico... Isso pode levar alguns instantes.</p>
    </div>
  );
};
