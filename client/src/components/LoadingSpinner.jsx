// src/components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-auto">
      <div className="relative flex items-center justify-center">
        <div className="w-32 h-32 border-t-4 border-b-4 border-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-lg font-semibold text-gray-700">Loading...</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
