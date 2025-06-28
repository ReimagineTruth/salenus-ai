import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useRouteTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentFeature, setCurrentFeature] = useState('');
  const location = useLocation();

  const navigateToFeature = (featureName: string, route: string, callback?: () => void) => {
    setIsTransitioning(true);
    setCurrentFeature(featureName);
    
    // Simulate loading time with animation
    setTimeout(() => {
      if (callback) {
        callback();
      }
      setIsTransitioning(false);
      setCurrentFeature('');
    }, 1500); // 1.5 seconds loading time
  };

  // Reset transition state when location changes
  useEffect(() => {
    setIsTransitioning(false);
    setCurrentFeature('');
  }, [location.pathname]);

  return {
    isTransitioning,
    currentFeature,
    navigateToFeature
  };
}; 