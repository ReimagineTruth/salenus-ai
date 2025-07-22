import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { mobileUtils } from './lib/mobile-utils'

// Initialize mobile utilities first
mobileUtils.handleMobileErrors();
mobileUtils.addMobileClass();
mobileUtils.optimizeForMobile();

// Show mobile loading screen if on mobile
if (mobileUtils.isMobileDevice()) {
  mobileUtils.showMobileLoadingScreen();
}

// Mobile-specific error handling
const handleMobileErrors = () => {
  // Prevent unhandled promise rejections from breaking the app
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  });

  // Prevent Pi SDK errors from breaking the app
  window.addEventListener('error', (event) => {
    if (event.message.includes('Pi') || event.message.includes('pi-sdk')) {
      console.warn('Pi SDK error caught:', event.message);
      event.preventDefault();
      return false;
    }
  });

  // Handle mobile-specific issues
  if (mobileUtils.isMobileDevice()) {
    console.log('Mobile device detected, applying mobile-specific fixes');
    
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Prevent pull-to-refresh on mobile
    document.addEventListener('touchmove', (event) => {
      if (event.scale !== 1) {
        event.preventDefault();
      }
    }, { passive: false });
  }
};

// Initialize mobile error handling
handleMobileErrors();

// Create root with error boundary
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  
  // Wrap app in error boundary
  const AppWithErrorBoundary = () => {
    try {
      return <App />;
    } catch (error) {
      console.error('App initialization error:', error);
      
      // Hide mobile loading screen if there's an error
      if (mobileUtils.isMobileDevice()) {
        mobileUtils.hideMobileLoadingScreen();
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-4">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Initialization Error</h1>
            <p className="text-gray-600 mb-4">Failed to load the application. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
  };

  // Render app and hide mobile loading screen when ready
  root.render(<AppWithErrorBoundary />);
  
  // Hide mobile loading screen after a short delay to ensure app is loaded
  if (mobileUtils.isMobileDevice()) {
    setTimeout(() => {
      mobileUtils.hideMobileLoadingScreen();
    }, 2000);
  }
} else {
  console.error('Root element not found');
}
