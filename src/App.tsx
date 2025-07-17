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

import FooterPageLayout from './components/FooterPageLayout';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import SplashScreen from './components/SplashScreen';
import { SEO } from './components/SEO';
import { toast } from '@/hooks/use-toast';

const queryClient = new QueryClient();

const App = () => {
  const [currentStep, setCurrentStep] = useState<'splash' | 'login' | 'plan' | 'landing' | 'payment' | 'dashboard'>('splash');
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
      
      // Check if user is authenticated via Supabase
      if (authUser && user) {
        // User is authenticated and has data
        console.log('User authenticated and has data, going to dashboard');
        setSelectedPlan(user.plan);
        setCurrentStep('dashboard');
      } else if (authUser && !user) {
        // User is authenticated but no app data yet - go to landing page instead of staying on splash
        console.log('User authenticated but no app data, going to landing page');
        setCurrentStep('landing');
      } else {
        // No authenticated user
        console.log('No authenticated user, going to login');
        setCurrentStep('login');
      }
      
      setIsLoading(false);
    };

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.log('Initialization timeout reached, forcing to landing page');
      setIsLoading(false);
      setCurrentStep('landing');
    }, 3000); // 3 second timeout

    // Simulate splash screen for 2 seconds, then initialize
    const timer = setTimeout(() => {
      initializeApp();
      clearTimeout(timeoutId);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(timeoutId);
    };
  }, [authUser, user]);

  // Handle workflow progression
  const handleLogin = async (userData: any) => {
    try {
      // Use Supabase login
      const authUser = await login(userData.email, userData.password);
      if (authUser) {
        // Existing users go directly to dashboard
        console.log('Existing user logged in, going to dashboard');
        setCurrentStep('dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleSignup = async (userData: any) => {
    try {
      // Use Supabase register
      const authUser = await register(userData.email, userData.password, userData.name);
      if (authUser) {
        // After signup, go to plan selection
        console.log('New user signed up, going to plan selection');
        setCurrentStep('plan');
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const handleChoosePlan = (plan: string, billing: string = 'monthly') => {
    setSelectedPlan(plan);
    setPricingToggle(billing);
    if (plan === 'Free') {
      setCurrentStep('dashboard');
    } else {
      setCurrentStep('payment');
    }
  };

  const handlePaymentComplete = async () => {
    console.log('Payment completed! Updating user plan...');
    console.log('Previous user state:', user);
    console.log('Selected plan:', selectedPlan);
    console.log('Pricing toggle:', pricingToggle);
    
    try {
      // Use Supabase upgrade plan
      await upgradePlan(selectedPlan as any);
      
      setCurrentStep('dashboard');
      
      // Show success message
      console.log(`Payment successful! Welcome to ${selectedPlan} plan.`);
      
      toast({
        title: "Payment Successful",
        description: `You've successfully upgraded to the ${selectedPlan} plan.`,
      });
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
      await logout();
      setCurrentStep('login');
    } catch (error) {
      console.error('Logout error:', error);
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

  // Render the appropriate component based on current step
  const renderContent = () => {
    // Show splash screen during initial load
    if (isLoading || authLoading || currentStep === 'splash') {
      return (
        <>
          <SEO title="Salenus AI — Loading..." description="Loading your Pi-powered AI coaching experience..." />
          <SplashScreen />
        </>
      );
    }

    // Show login page
    if (currentStep === 'login') {
      return (
        <>
          <SEO title="Sign In — Salenus AI" description="Sign in to your Salenus AI account and access your Pi-powered AI coaching dashboard." />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LoginPage onLogin={handleLogin} onSignup={handleSignup} />
          </BrowserRouter>
        </>
      );
    }

    // Show landing page (free account)
    if (currentStep === 'landing') {
      return (
        <>
          <SEO config="home" />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Index 
              user={user} 
              selectedPlan={selectedPlan}
              hasPaid={user?.hasPaid || false}
              onChoosePlan={(plan, billing) => handleChoosePlan(plan, billing)}
              onLogout={handleLogout}
            />
          </BrowserRouter>
        </>
      );
    }

    // Show plan selection after signup
    if (currentStep === 'plan') {
      return (
        <>
          <SEO title="Choose Your Plan — Salenus AI" description="Select your plan to get started with Salenus AI." />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Index 
              user={user} 
              selectedPlan={selectedPlan}
              hasPaid={user?.hasPaid || false}
              onChoosePlan={handleChoosePlan}
              onLogout={handleLogout}
              forceShowPlanSelection={true}
            />
          </BrowserRouter>
        </>
      );
    }

    // Show payment page
    if (currentStep === 'payment') {
      const planPrice = getPlanPrice(selectedPlan, pricingToggle);
      const billingText = pricingToggle === 'monthly' ? 'month' : 'year';
      
      return (
        <>
          <SEO 
            title={`Payment — ${selectedPlan} Plan — Salenus AI`}
            description={`Complete your payment for the ${selectedPlan} plan. Upgrade to unlock advanced AI coaching features and boost your productivity.`}
            keywords={`Salenus AI payment, ${selectedPlan} plan, Pi payments, AI coaching upgrade`}
          />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-teal-100">
              <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
                <div className="text-center mb-6">
                  <img src="/logo.png" alt="Salenus A.I Logo" className="h-16 w-16 mx-auto mb-4 rounded-full" />
                  <h1 className="text-2xl font-bold text-indigo-700 mb-2">Complete Your Payment</h1>
                  <p className="text-slate-600">You're upgrading to the <span className="font-semibold">{selectedPlan}</span> plan</p>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-indigo-700 mb-2">Plan Details</h3>
                  <div className="text-sm text-slate-600">
                    <p><span className="font-medium">Plan:</span> {selectedPlan}</p>
                    <p><span className="font-medium">Price:</span> {planPrice}</p>
                    <p><span className="font-medium">Billing:</span> {pricingToggle === 'monthly' ? 'Monthly' : 'Yearly (Save 17%)'}</p>
                    <p><span className="font-medium">Payment Method:</span> Pi Network</p>
                  </div>
                  
                  {/* Billing Cycle Details */}
                  <div className="mt-4 p-3 bg-white rounded border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-indigo-800">
                          {pricingToggle === 'monthly' ? 'Monthly Billing' : 'Yearly Billing'}
                        </p>
                        <p className="text-xs text-indigo-600">
                          {pricingToggle === 'monthly' ? 
                            'Billed monthly, cancel anytime' : 
                            'Billed annually, save 17% compared to monthly'
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-indigo-800">
                          {pricingToggle === 'monthly' ? '30 days' : '365 days'}
                        </p>
                        <p className="text-xs text-indigo-600">Access period</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Billing Cycle Toggle */}
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h4 className="font-medium text-slate-700 mb-3">Billing Cycle</h4>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="billing"
                          value="monthly"
                          checked={pricingToggle === 'monthly'}
                          onChange={() => setPricingToggle('monthly')}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Monthly</span>
                        <span className="text-xs text-slate-500">(${selectedPlan === 'Basic' ? '5' : selectedPlan === 'Pro' ? '10' : '15'} Pi/month)</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="billing"
                          value="yearly"
                          checked={pricingToggle === 'yearly'}
                          onChange={() => setPricingToggle('yearly')}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">Yearly</span>
                        <span className="text-xs text-slate-500">(${selectedPlan === 'Basic' ? '50' : selectedPlan === 'Pro' ? '100' : '150'} Pi/year)</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Save 17%</span>
                      </label>
                    </div>
                  </div>

                  <button 
                    onClick={handlePaymentComplete}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Pay {planPrice} with Pi
                  </button>
                  <button 
                    onClick={() => setCurrentStep('landing')}
                    className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Back to Landing
                  </button>
                </div>

                <div className="text-center mt-6">
                  <p className="text-xs text-slate-500">Need help? <a href="mailto:support@salenus.ai" className="text-indigo-600 underline">support@salenus.ai</a></p>
                </div>
              </div>
            </div>
          </BrowserRouter>
        </>
      );
    }

    // Show dashboard (for all logged-in users)
    if (currentStep === 'dashboard' && user) {
      return (
        <>
          <SEO config="dashboard" />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <UserDashboard 
              user={user} 
              onLogout={handleLogout}
              onUpgrade={(plan) => {
                setSelectedPlan(plan);
                setCurrentStep('payment');
              }}
            />
          </BrowserRouter>
        </>
      );
    }

    // Redirect non-logged users to login
    if (currentStep === 'dashboard' && !user) {
      setCurrentStep('login');
      return null;
    }

    // Default routing for other pages
    return (
      <>
        <SEO config="home" />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/dashboard/*"
              element={
                user ? (
                  <UserDashboard 
                    user={user} 
                    onLogout={handleLogout}
                    onUpgrade={(plan) => {
                      setSelectedPlan(plan);
                      setCurrentStep('payment');
                    }}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/home"
              element={
                user ? (
                  <HomeDashboard 
                    user={user} 
                    onLogout={handleLogout}
                    onUpgrade={(plan) => {
                      setSelectedPlan(plan);
                      setCurrentStep('payment');
                    }}
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage onLogin={handleLogin} onSignup={handleSignup} />
                )
              }
            />
            <Route
              path="*"
              element={
                <FooterPageLayout>
                  <Routes>
                    {/* Salenus AI Official Route */}
                    <Route path="/salenusaiofficial" element={<Index user={user} selectedPlan={selectedPlan} hasPaid={user?.hasPaid || false} onChoosePlan={(plan, billing) => handleChoosePlan(plan, billing)} onLogout={handleLogout} />} />
                    {/* Redirect free-preview to salenusaiofficial */}
                    <Route path="/free-preview" element={<Navigate to="/salenusaiofficial" replace />} />
                    {/* Redirect common feature routes to dashboard equivalents */}
                    <Route path="/habits" element={<Navigate to="/dashboard/habits" replace />} />
                    <Route path="/tasks" element={<Navigate to="/dashboard/tasks" replace />} />
                    <Route path="/challenges" element={<Navigate to="/dashboard/challenges" replace />} />
                    <Route path="/sync" element={<Navigate to="/dashboard/sync" replace />} />
                    <Route path="/mobile" element={<Navigate to="/dashboard/mobile" replace />} />
                    <Route path="/notifications" element={<Navigate to="/dashboard/notifications" replace />} />
                    <Route path="/logout" element={<LogoutPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </FooterPageLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </>
    );
  };

  // Always return the same structure - this prevents the hooks error
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {renderContent()}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App; 
