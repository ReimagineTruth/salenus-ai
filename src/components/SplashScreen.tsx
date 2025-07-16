import React, { useState, useEffect } from 'react';

const SplashScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-teal-100 flex items-center justify-center p-4">
      {/* Main Content */}
      <div className="text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Salenus A.I Logo" className="w-20 h-20 rounded-full" />
        </div>

        {/* App Name */}
        <h1 className="text-3xl font-bold text-indigo-700 mb-2">
          Salenus A.I Personal Coach
        </h1>

        {/* Tagline */}
        <p className="text-lg text-indigo-600 mb-2 font-medium">
          The first Pi-powered AI coach
        </p>

        {/* Organization */}
        <p className="text-sm text-gray-600 mb-8">
          by mrwain organization
        </p>

        {/* Loading Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Loading...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Support */}
        <p className="text-xs text-gray-500">
          Need help? <a href="mailto:support@salenus.ai" className="text-blue-500 underline">support@salenus.ai</a>
        </p>
      </div>
    </div>
  );
};

export default SplashScreen; 