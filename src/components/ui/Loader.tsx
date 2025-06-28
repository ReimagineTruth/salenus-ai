import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'sparkle';
}

export const Loader: React.FC<LoaderProps> = ({ 
  message = "Loading your feature...", 
  size = 'md',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="relative">
        {variant === 'sparkle' ? (
          <div className="relative">
            <Sparkles className={`${sizeClasses[size]} text-indigo-600 animate-pulse`} />
            <div className="absolute inset-0">
              <Sparkles className={`${sizeClasses[size]} text-purple-600 animate-ping`} />
            </div>
          </div>
        ) : (
          <Loader2 className={`${sizeClasses[size]} text-indigo-600 animate-spin`} />
        )}
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-gray-600 font-medium">{message}</p>
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export const FeatureLoader: React.FC<{ featureName: string }> = ({ featureName }) => {
  return (
    <Loader 
      message={`Loading ${featureName}...`}
      size="lg"
      variant="sparkle"
    />
  );
}; 