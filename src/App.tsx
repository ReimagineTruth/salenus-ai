import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/useIsMobile';
import { MobileUtils } from '@/lib/mobile-utils';

// Pages
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';

// Components
import PlanBasedDashboard from '@/components/PlanBasedDashboard';
import { EnhancedAICoach } from '@/components/features/EnhancedAICoach';
import { AdvancedAnalytics } from '@/components/features/AdvancedAnalytics';
import { EnhancedCommunity } from '@/components/features/EnhancedCommunity';

// PWA Registration
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available
              console.log('New content is available; please refresh.');
            }
          });
        }
      });
      
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// PWA Install Prompt
const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA installed successfully');
      }
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return { isInstallable, installPWA };
};

const App = () => {
  const { user, authUser, login, register, logout, upgradePlan } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [pricingToggle, setPricingToggle] = useState('monthly');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // PWA functionality
  const { isInstallable, installPWA } = usePWAInstall();

  // STEP 5: Set correct base path for subdomain routing
  const getBasePath = () => {
    const hostname = window.location.hostname;
    if (hostname.includes('pinet.com')) {
      // Extract subdomain path if needed
      const pathParts = window.location.pathname.split('/');
      if (pathParts.length > 1 && pathParts[1]) {
        return `/${pathParts[1]}`;
      }
    }
    return '';
  };

  // Pi Browser specific initialization
  useEffect(() => {
    const isPiBrowser = navigator.userAgent.toLowerCase().includes('pi') || 
                       navigator.userAgent.toLowerCase().includes('minepi');
    
    if (isPiBrowser) {
      console.log('🌐 Pi Browser detected in App component');
      
      // Force repaint for Pi Browser
      const forceRepaint = () => {
        document.body.style.display = 'none';
        document.body.offsetHeight;
        document.body.style.display = '';
      };
      
      forceRepaint();
      
      // Ensure proper viewport height
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      setVH();
      window.addEventListener('resize', setVH);
      window.addEventListener('orientationchange', setVH);
      
      // Force multiple repaints to ensure rendering
      setTimeout(forceRepaint, 100);
      setTimeout(forceRepaint, 500);
      setTimeout(forceRepaint, 1000);
      
      return () => {
        window.removeEventListener('resize', setVH);
        window.removeEventListener('orientationchange', setVH);
      };
    }
  }, []);

  // Initialize mobile utilities
  useEffect(() => {
    // MobileUtils is a singleton, so we just need to get the instance
    // The initialization happens automatically in the constructor
    const mobileUtils = MobileUtils.getInstance();
    mobileUtils.addMobileClass();
    mobileUtils.handleMobileErrors();
    mobileUtils.optimizeForMobile();
  }, []);

  // Register service worker for PWA
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Set loading to false after authentication is initialized
  useEffect(() => {
    // Set loading to false when auth state is determined
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [authUser]);

  // Handle payment completion
  const handlePaymentComplete = (plan: string) => {
    console.log('Payment completed for plan:', plan);
    upgradePlan(plan);
    
    // Show success message
    const planFeatures = {
      'Basic': 'community challenges, cross-platform sync, and mobile access',
      'Pro': 'mood tracking, advanced goals, smart reminders, and priority support',
      'Premium': 'AI personal coach, advanced analytics, VIP support, and exclusive features'
    };

    const successMessage = `🎉 Welcome to ${plan} Plan! You now have access to ${planFeatures[plan as keyof typeof planFeatures]}.`;
    
    // You can use a toast library here
    console.log(successMessage);
  };

  // Handle plan selection
  const handleChoosePlan = (plan: string) => {
    setSelectedPlan(plan);
    if (user) {
      // If user is logged in, redirect to dashboard
      window.location.href = '/dashboard';
    }
  };

  // Handle upgrade in dashboard
  const handleUpgrade = (currentPlan: string) => {
    const nextPlan = {
      'Free': 'Basic',
      'Basic': 'Pro',
      'Pro': 'Premium'
    }[currentPlan] || 'Basic';
    
    setSelectedPlan(nextPlan);
    // Redirect to pricing page or show upgrade modal
    window.location.href = '/#pricing';
  };

  // Check if user has access to specific features
  const hasFeature = (featureName: string): boolean => {
    const featureAccess = {
      'enhanced_ai_coach': ['Premium'],
      'advanced_analytics': ['Premium'],
      'enhanced_community': ['Basic', 'Pro', 'Premium'],
      'pwa_features': ['Basic', 'Pro', 'Premium']
    };
    return featureAccess[featureName as keyof typeof featureAccess]?.includes(user?.plan || 'Free') || false;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Salenus AI...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter basename={getBasePath()}>
      <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Routes>
          <Route path="/" element={<Index />} />
          
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <PlanBasedDashboard 
                  user={user} 
                  onUpgrade={handleUpgrade}
                  enhancedFeatures={{
                    aiCoach: hasFeature('enhanced_ai_coach'),
                    analytics: hasFeature('advanced_analytics'),
                    community: hasFeature('enhanced_community'),
                    pwa: hasFeature('pwa_features')
                  }}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Enhanced Feature Routes */}
          <Route 
            path="/ai-coach" 
            element={
              user && hasFeature('enhanced_ai_coach') ? (
                <EnhancedAICoach />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          
          <Route 
            path="/analytics" 
            element={
              user && hasFeature('advanced_analytics') ? (
                <AdvancedAnalytics />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          
          <Route 
            path="/community" 
            element={
              user && hasFeature('enhanced_community') ? (
                <EnhancedCommunity />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            } 
          />
          
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* PWA Install Prompt */}
        {isInstallable && (
          <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Install Salenus AI</h3>
                <p className="text-sm text-gray-600">Get quick access to your productivity coach</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={installPWA}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Install
                </button>
                <button
                  onClick={() => setIsInstallable(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Not now
                </button>
              </div>
            </div>
          </div>
        )}
        
        <Toaster />
      </div>
      </TooltipProvider>
    </BrowserRouter>
  );
};

export default App; 
