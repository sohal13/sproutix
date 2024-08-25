import React from 'react';
import {useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const history = useNavigate();

  const handleGoHome = () => {
    history('/');
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Oops! Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <button
          onClick={handleGoHome}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition"
        >
          Go to Home Page
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
