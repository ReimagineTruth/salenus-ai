import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { UserDashboard } from "./components/UserDashboard";
import { HomeDashboard } from "./components/HomeDashboard";
import { useAuth } from "./hooks/useAuth";
import { supabase } from './lib/supabase';

import FooterPageLayout from './components/FooterPageLayout';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import { Help } from './pages/Help';
import SplashScreen from './components/SplashScreen';
import { SEO } from './components/SEO';
import { toast } from '@/hooks/use-toast';

const queryClient = new QueryClient();

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
            <p className="text-gray-600 mb-4">Something went wrong. Please try refreshing the page.</p>
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

    return this.props.children;
  }
}

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('Free');
  const [pricingToggle, setPricingToggle] = useState('monthly');
  
  // Use the Supabase auth hook - ALWAYS call this
  const { user, authUser, isLoading: authLoading, login, register, logout, upgradePlan } = useAuth();

  // Initialize app and check for existing user
  useEffect(() => {
    const initializeApp = () => {
      console.log('Initializing app...');
      console.log('Auth user:', authUser);
      console.log('User data:', user);
      
      if (user) {
        console.log('User found, app ready');
      } else {
        console.log('No user found, redirecting to login');
      }
      
      setIsLoading(false);
    };

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Initialization timeout reached');
      setIsLoading(false);
    }, 5000); // Increased timeout for real auth

    // Initialize when auth state is determined
    if (authLoading) {
      // Still loading auth state
      return;
    } else {
      initializeApp();
      clearTimeout(timeoutId);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [authUser, user, authLoading]);

  // Handle workflow progression
  const handleLogin = async (userData: any) => {
    try {
      // Use Supabase login
      const authUser = await login(userData.email, userData.password);
      if (authUser) {
        // Existing users go directly to dashboard
        console.log('Existing user logged in, going to dashboard');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleSignup = async (userData: any) => {
    try {
      // Use Supabase register
      const authUser = await register(userData.email, userData.password, userData.name, userData.plan);
      if (authUser) {
        // After signup, check if user selected a paid plan
        if (userData.plan === 'Free') {
          console.log('Free plan selected, going directly to dashboard');
          window.location.href = '/dashboard';
        } else {
          console.log('Paid plan selected, going to payment');
          setSelectedPlan(userData.plan);
          window.location.href = '/payment';
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const handleChoosePlan = (plan: string, billing: string = 'monthly') => {
    setSelectedPlan(plan);
    setPricingToggle(billing);
    
    if (!user) {
      // User is not logged in, redirect to signup
      toast({
        title: "Welcome to Salenus A.I! 🎉",
        description: `Let's get you set up with the ${plan} plan. Creating your account...`,
        duration: 4000,
      });
      window.location.href = '/signup';
    } else {
      // User is already logged in, redirect to payment for plan upgrade
      toast({
        title: "Welcome to Salenus A.I! 🎉",
        description: `Great to have you on board, ${user.name || user.email?.split('@')[0]}! Redirecting to payment...`,
        duration: 4000,
      });
      window.location.href = '/payment';
    }
  };

  const handlePaymentComplete = async () => {
    console.log('Payment processing started...');
    console.log('Selected plan:', selectedPlan);
    console.log('Pricing toggle:', pricingToggle);
    
    // Show processing toast
    toast({
      title: "Processing Payment...",
      description: `Processing your ${selectedPlan} plan payment...`,
      duration: 2000,
    });
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user plan
      await upgradePlan(selectedPlan as any);
      
      // Show success message
      console.log(`Payment successful! Welcome to ${selectedPlan} plan.`);
      
      toast({
        title: "Payment Successful! 🎉",
        description: `Welcome to the ${selectedPlan} plan! You now have access to all premium features.`,
        duration: 4000,
      });
      
      // Show redirect message
      toast({
        title: "Redirecting to Dashboard...",
        description: "Taking you to your personalized dashboard where you can explore all your new features!",
        duration: 3000,
      });
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        console.log('Redirecting to dashboard after payment completion...');
        window.location.href = '/dashboard';
      }, 1500);
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      console.log('App: Starting logout process...');
      console.log('App: Current user before logout:', user);
      
      // Call the logout function from useAuth (this will clear user state)
      await logout();
      
      console.log('App: Logout successful, redirecting to home...');
      console.log('App: User after logout:', user);
      
      // Clear any stored data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userSession');
      localStorage.removeItem('authToken');
      
      // Force redirect to home page
      console.log('App: Redirecting to home page...');
      window.location.href = '/';
    } catch (error) {
      console.error('App: Logout error:', error);
      // Force redirect even if logout fails
      console.log('App: Force redirect due to error...');
      window.location.href = '/';
    }
  };

  // Get plan pricing based on billing cycle
  const getPlanPrice = (plan: string, billing: string) => {
    const pricing = {
      Basic: { monthly: '5 Pi', yearly: '50 Pi' },
      Pro: { monthly: '10 Pi', yearly: '100 Pi' },
      Premium: { monthly: '15 Pi', yearly: '150 Pi' }
    };
    return pricing[plan]?.[billing] || '5 Pi';
  };

  // Show splash screen during initial load
  if (isLoading || authLoading) {
    return (
      <ErrorBoundary>
        <SEO title="Salenus AI — Loading..." description="Loading your Pi-powered AI coaching experience..." />
        <SplashScreen />
      </ErrorBoundary>
    );
  }

  // Debug logging
  console.log('App - Current state:', {
    user,
    isLoading,
    authLoading,
    selectedPlan,
    pricingToggle
  });

  // Additional debugging for authentication
  console.log('App - Authentication details:', {
    hasUser: !!user,
    userEmail: user?.email,
    userPlan: user?.plan,
    userHasPaid: user?.hasPaid,
    isLoading,
    authLoading
  });

  // Add a simple loading state to prevent white screen
  if (isLoading || authLoading) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Salenus AI...</p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SEO title="Salenus AI — Pi-Powered AI Personal Coach" description="Transform your life with Salenus AI, the first Pi-powered AI coach designed exclusively for the Pi Network ecosystem." />
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            {/* Main landing page */}
            <Route path="/" element={
              <Index 
                user={user} 
                selectedPlan={selectedPlan}
                hasPaid={user?.hasPaid || false}
                onChoosePlan={(plan, billing) => handleChoosePlan(plan, billing)}
                onLogout={handleLogout}
              />
            } />
            
            {/* Login page */}
            <Route path="/login" element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage onLogin={handleLogin} onSignup={handleSignup} />
              )
            } />
            
            {/* Signup page */}
            <Route path="/signup" element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage onLogin={handleLogin} onSignup={handleSignup} forceSignupMode={true} selectedPlan={selectedPlan} />
              )
            } />
            
            {/* Payment page */}
            <Route path="/payment" element={
              user ? (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-teal-100">
                  <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                    <div className="text-center mb-6">
                      <img src="/logo.png" alt="Salenus A.I Logo" className="h-16 w-16 mx-auto mb-4 rounded-full" />
                      <h1 className="text-2xl font-bold text-indigo-700 mb-2">Welcome to Salenus A.I! 🎉</h1>
                      <p className="text-slate-600 mb-2">Great to have you on board, <span className="font-semibold">{user.name || user.email?.split('@')[0]}</span>!</p>
                      <p className="text-slate-600">You're upgrading to the <span className="font-semibold">{selectedPlan}</span> plan</p>
                    </div>

                    <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600">Plan:</span>
                        <span className="font-semibold text-indigo-700">{selectedPlan}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-600">Billing:</span>
                        <span className="font-semibold text-indigo-700">{pricingToggle === 'monthly' ? 'Monthly' : 'Yearly'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Price:</span>
                        <span className="font-semibold text-indigo-700">{getPlanPrice(selectedPlan, pricingToggle)} per {pricingToggle === 'monthly' ? 'month' : 'year'}</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button 
                        onClick={handlePaymentComplete}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                      >
                        Mock Payment - {getPlanPrice(selectedPlan, pricingToggle)}
                      </button>
                      <button 
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 px-4 rounded-lg font-semibold transition-colors"
                      >
                        Back to Landing
                      </button>
                    </div>

                    <div className="text-center mt-6">
                      <p className="text-xs text-slate-500 mb-2">Need help? <a href="mailto:support@salenus.ai" className="text-indigo-600 underline">support@salenus.ai</a></p>
                      <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                        💡 This is a mock payment for testing purposes
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            } />
            
            {/* Dashboard */}
            <Route path="/dashboard/*" element={
              (() => {
                console.log('Dashboard route accessed - User:', user);
                return user ? (
                  <ErrorBoundary fallback={
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h1>
                        <p className="text-gray-600 mb-4">There was an error loading the dashboard. Please try refreshing the page.</p>
                        <button 
                          onClick={() => window.location.reload()}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Refresh Page
                        </button>
                      </div>
                    </div>
                  }>
                    <UserDashboard 
                      user={user} 
                      onLogout={handleLogout}
                      onUpgrade={(plan) => {
                        setSelectedPlan(plan);
                        // Use mock payment - redirect to dashboard
                        toast({
                          title: "Plan Upgraded! 🎉",
                          description: `Your plan has been upgraded to ${plan}. Welcome to premium features!`,
                          duration: 4000,
                        });
                        window.location.href = '/dashboard';
                      }}
                    />
                  </ErrorBoundary>
                ) : (
                  <Navigate to="/" replace />
                );
              })()
            } />
            
            {/* Home dashboard */}
            <Route path="/home" element={
              user ? (
                <HomeDashboard 
                  user={user} 
                  onLogout={handleLogout}
                  onUpgrade={(plan) => {
                    setSelectedPlan(plan);
                    // Use mock payment - redirect to dashboard
                    toast({
                      title: "Plan Upgraded! 🎉",
                      description: `Your plan has been upgraded to ${plan}. Welcome to premium features!`,
                      duration: 4000,
                    });
                    window.location.href = '/dashboard';
                  }}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } />
            
            {/* Other routes */}
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/help" element={<Help />} />
            <Route path="/salenusaiofficial" element={
              <Index 
                user={user} 
                selectedPlan={selectedPlan}
                hasPaid={user?.hasPaid || false}
                onChoosePlan={(plan, billing) => handleChoosePlan(plan, billing)}
                onLogout={handleLogout}
              />
            } />
            <Route path="/free-preview" element={<Navigate to="/" replace />} />
            <Route path="/habits" element={<Navigate to="/dashboard/habits" replace />} />
            <Route path="/tasks" element={<Navigate to="/dashboard/tasks" replace />} />
            <Route path="/challenges" element={<Navigate to="/dashboard/challenges" replace />} />
            <Route path="/sync" element={<Navigate to="/dashboard/sync" replace />} />
            <Route path="/mobile" element={<Navigate to="/dashboard/mobile" replace />} />
            <Route path="/notifications" element={<Navigate to="/dashboard/notifications" replace />} />
            
            {/* Test route for debugging */}
            <Route path="/test-dashboard" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
                  <h1 className="text-2xl font-bold mb-4">Dashboard Debug</h1>
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800">🎉 Mock Authentication Active</h3>
                      <p className="text-green-700 text-sm">You're using mock authentication for testing. You should be automatically logged in!</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold">Authentication State:</h3>
                      <p>User: {user ? 'Logged in' : 'Not logged in'}</p>
                      <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
                      <p>Auth Loading: {authLoading ? 'Yes' : 'No'}</p>
                    </div>
                    
                    {user && (
                      <div>
                        <h3 className="font-semibold">User Data:</h3>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                          {JSON.stringify(user, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <button 
                        onClick={() => window.location.href = '/dashboard'}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Try Dashboard
                      </button>
                      
                      <button 
                        onClick={() => window.location.href = '/login'}
                        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Go to Login
                      </button>
                      
                      <button 
                        onClick={() => window.location.href = '/signup'}
                        className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                      >
                        Go to Signup
                      </button>
                      
                      <button 
                        onClick={() => {
                          console.log('Test: Current user state:', user);
                          console.log('Test: Auth loading:', authLoading);
                          console.log('Test: App loading:', isLoading);
                        }}
                        className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                      >
                        Test Auth State (Check Console)
                      </button>
                      
                      <button 
                        onClick={async () => {
                          try {
                            const { data, error } = await supabase.auth.getSession();
                            console.log('Supabase test - Session:', data);
                            console.log('Supabase test - Error:', error);
                            
                            if (data.session) {
                              console.log('Supabase test - User email:', data.session.user.email);
                            }
                          } catch (err) {
                            console.error('Supabase test error:', err);
                          }
                        }}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Test Supabase Connection
                      </button>
                      
                      <button 
                        onClick={() => {
                          console.log('Mock auth: Current user:', user);
                          console.log('Mock auth: You should be automatically logged in with mock user');
                          console.log('Mock auth: Try going to /dashboard now');
                        }}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        Check Mock Auth Status
                      </button>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Test Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            } />
            
            {/* Simple Test Route */}
            <Route path="/test-auth" element={
              <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
                  <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-800">Current State:</h3>
                      <p>User: {user ? 'Logged In' : 'Not Logged In'}</p>
                      <p>Email: {user?.email || 'None'}</p>
                      <p>Plan: {user?.plan || 'None'}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <button 
                        onClick={() => window.location.href = '/dashboard'}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Go to Dashboard
                      </button>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Test Logout
                      </button>
                      
                      <button 
                        onClick={() => window.location.href = '/login'}
                        className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Go to Login
                      </button>
                      
                      <button 
                        onClick={() => window.location.href = '/signup'}
                        className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                      >
                        Go to Signup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            } />
            
            {/* Complete App Workflow Guide */}
            <Route path="/workflow-guide" element={
              <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-center mb-8">🚀 Complete App Workflow Guide</h1>
                    
                    <div className="space-y-8">
                      {/* Landing Page */}
                      <div className="border-l-4 border-blue-500 pl-6">
                        <h2 className="text-xl font-semibold mb-4">1. Landing Page (/)</h2>
                        <p className="text-gray-600 mb-4">Start here to explore the app and choose your plan.</p>
                        <div className="space-y-2">
                          <a href="/" className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center">
                            Go to Landing Page
                          </a>
                          <p className="text-sm text-gray-500">• View hero section and features</p>
                          <p className="text-sm text-gray-500">• Choose a plan (Free/Basic/Pro/Premium)</p>
                          <p className="text-sm text-gray-500">• Sign up or log in</p>
                        </div>
                      </div>

                      {/* Authentication */}
                      <div className="border-l-4 border-green-500 pl-6">
                        <h2 className="text-xl font-semibold mb-4">2. Authentication</h2>
                        <p className="text-gray-600 mb-4">Create account or sign in with mock authentication.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <a href="/signup" className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-center mb-2">
                              Sign Up
                            </a>
                            <p className="text-sm text-gray-500">• Create new account</p>
                            <p className="text-sm text-gray-500">• Choose plan during signup</p>
                            <p className="text-sm text-gray-500">• Redirects to dashboard</p>
                          </div>
                          <div>
                            <a href="/login" className="block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 text-center mb-2">
                              Sign In
                            </a>
                            <p className="text-sm text-gray-500">• Login with existing account</p>
                            <p className="text-sm text-gray-500">• Welcome back message</p>
                            <p className="text-sm text-gray-500">• Redirects to dashboard</p>
                          </div>
                        </div>
                      </div>

                      {/* Dashboard */}
                      <div className="border-l-4 border-indigo-500 pl-6">
                        <h2 className="text-xl font-semibold mb-4">3. Dashboard (/dashboard)</h2>
                        <p className="text-gray-600 mb-4">Main dashboard with all features and navigation.</p>
                        <div className="space-y-2">
                          <a href="/dashboard" className="block bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 text-center">
                            Go to Dashboard
                          </a>
                          <p className="text-sm text-gray-500">• Welcome message and user stats</p>
                          <p className="text-sm text-gray-500">• Sidebar navigation</p>
                          <p className="text-sm text-gray-500">• Feature overview and access</p>
                        </div>
                      </div>

                      {/* Feature Testing */}
                      <div className="border-l-4 border-orange-500 pl-6">
                        <h2 className="text-xl font-semibold mb-4">4. Feature Testing</h2>
                        <p className="text-gray-600 mb-4">Test all available features based on your plan.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold mb-2">Free Features:</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• Free Habit Preview</li>
                              <li>• Pi Network Integration</li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Premium Features:</h3>
                            <ul className="text-sm text-gray-600 space-y-1">
                              <li>• AI Personal Coach</li>
                              <li>• Advanced Analytics</li>
                              <li>• Calendar Integration</li>
                              <li>• All Basic & Pro features</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Payment Flow */}
                      <div className="border-l-4 border-red-500 pl-6">
                        <h2 className="text-xl font-semibold mb-4">5. Payment Flow</h2>
                        <p className="text-gray-600 mb-4">Test the mock payment system for plan upgrades.</p>
                        <div className="space-y-2">
                          <a href="/payment" className="block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-center">
                            Test Payment Page
                          </a>
                          <p className="text-sm text-gray-500">• Mock payment processing</p>
                          <p className="text-sm text-gray-500">• Plan upgrade simulation</p>
                          <p className="text-sm text-gray-500">• Success/error handling</p>
                        </div>
                      </div>

                      {/* Mobile Testing */}
                      <div className="border-l-4 border-teal-500 pl-6">
                        <h2 className="text-xl font-semibold mb-4">6. Mobile Experience</h2>
                        <p className="text-gray-600 mb-4">Test responsive design and mobile features.</p>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-500">• Resize browser window to test mobile layout</p>
                          <p className="text-sm text-gray-500">• Test mobile navigation and sidebar</p>
                          <p className="text-sm text-gray-500">• Check responsive design on all pages</p>
                        </div>
                      </div>

                      {/* Debug Tools */}
                      <div className="border-l-4 border-gray-500 pl-6">
                        <h2 className="text-xl font-semibold mb-4">7. Debug Tools</h2>
                        <p className="text-gray-600 mb-4">Useful tools for testing and debugging.</p>
                        <div className="space-y-2">
                          <a href="/test-dashboard" className="block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-center">
                            Debug Dashboard
                          </a>
                          <p className="text-sm text-gray-500">• Check authentication state</p>
                          <p className="text-sm text-gray-500">• Test Supabase connection</p>
                          <p className="text-sm text-gray-500">• View user data and logs</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-2">🎯 Testing Checklist:</h3>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>✅ Landing page loads correctly</li>
                        <li>✅ Sign up flow works</li>
                        <li>✅ Sign in flow works</li>
                        <li>✅ Dashboard displays properly</li>
                        <li>✅ All features are accessible</li>
                        <li>✅ Mock payment works</li>
                        <li>✅ Mobile responsive design</li>
                        <li>✅ Welcome messages appear</li>
                        <li>✅ Toast notifications work</li>
                        <li>✅ Navigation between pages</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
                  </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
    );
};

export default App; 
