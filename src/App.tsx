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

import FooterPageLayout from './components/FooterPageLayout';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import SplashScreen from './components/SplashScreen';
import { SEO } from './components/SEO';
import { toast } from '@/hooks/use-toast';

const queryClient = new QueryClient();

const App = () => {
  const [currentStep, setCurrentStep] = useState<'splash' | 'login' | 'landing' | 'payment' | 'dashboard'>('splash');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('Free');
  const [hasPaid, setHasPaid] = useState(false);
  const [pricingToggle, setPricingToggle] = useState('monthly');

  // Initialize app and check for existing user
  useEffect(() => {
    const initializeApp = () => {
      // Check for existing user in localStorage
      const savedUser = localStorage.getItem('currentUser');
      
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          if (userData.planExpiry && typeof userData.planExpiry === 'string') {
            userData.planExpiry = new Date(userData.planExpiry);
          }
          
          // Ensure user has required fields
          const validatedUser = {
            ...userData,
            plan: userData.plan || 'Free',
            hasPaid: userData.hasPaid || false,
            planExpiry: userData.planExpiry || null,
            isActive: userData.isActive !== false
          };
          
          // Set user state
          setUser(validatedUser);
          setSelectedPlan(validatedUser.plan);
          setHasPaid(validatedUser.hasPaid);
          
          // All logged-in users should go to dashboard, regardless of plan
          // The dashboard will handle plan-specific features and restrictions
          setCurrentStep('dashboard');
          
          // Update localStorage with validated data
          localStorage.setItem('currentUser', JSON.stringify(validatedUser));
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('currentUser');
          setCurrentStep('login');
        }
      } else {
        setCurrentStep('login');
      }
      
      setIsLoading(false);
    };

    // Simulate splash screen for 3 seconds, then initialize
    const timer = setTimeout(() => {
      initializeApp();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle workflow progression
  const handleLogin = (userData: any) => {
    // Ensure user has proper plan information and restore their existing plan
    const userWithPlan = {
      ...userData,
      plan: userData.plan || 'Free',
      hasPaid: userData.hasPaid || false,
      planExpiry: userData.planExpiry || null,
      isActive: userData.isActive !== false
    };
    
    // Update localStorage to ensure plan persistence
    localStorage.setItem('currentUser', JSON.stringify(userWithPlan));
    
    setUser(userWithPlan);
    setSelectedPlan(userWithPlan.plan);
    setHasPaid(userWithPlan.hasPaid);
    // All logged-in users can access dashboard
    setCurrentStep('dashboard');
  };

  const handleSignup = (userData: any) => {
    // Set user with proper plan information
    const userWithPlan = {
      ...userData,
      plan: 'Free',
      hasPaid: false,
      planExpiry: null,
      isActive: true
    };
    
    // Update localStorage to ensure plan persistence
    localStorage.setItem('currentUser', JSON.stringify(userWithPlan));
    
    setUser(userWithPlan);
    setSelectedPlan('Free');
    setHasPaid(false);
    // New users can access dashboard immediately
    setCurrentStep('dashboard');
  };

  const handleChoosePlan = (plan: string, billing: string = 'monthly') => {
    setSelectedPlan(plan);
    setPricingToggle(billing);
    setCurrentStep('payment');
  };

  const handlePaymentComplete = () => {
    console.log('Payment completed! Updating user plan...');
    console.log('Previous user state:', user);
    console.log('Selected plan:', selectedPlan);
    console.log('Pricing toggle:', pricingToggle);
    
    // Update user with the selected plan and payment status
    const updatedUser = {
      ...user,
      plan: selectedPlan,
      hasPaid: true,
      planExpiry: new Date(Date.now() + (pricingToggle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000).toISOString()
    };
    
    console.log('Updated user state:', updatedUser);
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    setUser(updatedUser);
    setHasPaid(true);
    setCurrentStep('dashboard');
    
    // Show success message
    console.log(`Payment successful! Welcome to ${selectedPlan} plan.`);
    
    toast({
      title: "Payment Successful",
      description: `You've successfully upgraded to the ${selectedPlan} plan.`,
    });
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('currentUser');
    
    // Reset state
    setUser(null);
    setSelectedPlan('Free');
    setHasPaid(false);
    setCurrentStep('login');
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
  if (isLoading || currentStep === 'splash') {
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
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SEO title="Sign In — Salenus AI" description="Sign in to your Salenus AI account and access your Pi-powered AI coaching dashboard." />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <LoginPage onLogin={handleLogin} onSignup={handleSignup} />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Show landing page (free account)
  if (currentStep === 'landing') {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SEO config="home" />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Index 
              user={user} 
              selectedPlan={selectedPlan}
              hasPaid={hasPaid}
              onChoosePlan={(plan, billing) => handleChoosePlan(plan, billing)}
              onLogout={handleLogout}
            />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Show payment page
  if (currentStep === 'payment') {
    const planPrice = getPlanPrice(selectedPlan, pricingToggle);
    const billingText = pricingToggle === 'monthly' ? 'month' : 'year';
    
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
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
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Show dashboard (for all logged-in users)
  if (currentStep === 'dashboard' && user) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
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
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Redirect non-logged users to login
  if (currentStep === 'dashboard' && !user) {
    setCurrentStep('login');
    return null;
  }

  // Default routing for other pages
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
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
                    <Route path="/salenusaiofficial" element={<Index user={user} selectedPlan={selectedPlan} hasPaid={hasPaid} onChoosePlan={(plan, billing) => handleChoosePlan(plan, billing)} onLogout={handleLogout} />} />
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
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
