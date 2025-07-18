import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  BarChart3, 
  ClipboardList, 
  Users, 
  Star, 
  Lightbulb, 
  Cloud, 
  Settings,
  Menu,
  X,
  Heart,
  Bell,
  Camera,
  Calendar,
  Trophy,
  Shield,
  Sparkles,
  PieChart,
  Smartphone,
  Wifi,
  BookOpen,
  GraduationCap,
  Flame,
  Globe,
  MessageSquare,
  ArrowRight,
  Play,
  ChevronDown,
  Pi,
  Brain,
  User,
  LogOut,
  LogIn,
  Mail,
  Key
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoginModal } from '@/components/LoginModal';
import { testSupabaseConnection, testAuthFlow } from '@/lib/test-auth';
import { UserDashboard } from '@/components/UserDashboard';
import { Link, useNavigate } from 'react-router-dom';
import { PaymentModal } from '@/components/PaymentModal';
import { PiAdModal } from '@/components/PiAdModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DemoDashboard } from '@/components/DemoDashboard';
import { CookieConsent } from '@/components/CookieConsent';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import FooterPageLayout from '@/components/FooterPageLayout';
import { toast } from '@/hooks/use-toast';

interface IndexProps {
  user?: any;
  selectedPlan?: string;
  hasPaid?: boolean;
  onChoosePlan?: (plan: string, billing: string) => void;
  onLogout?: () => void;
}

const Index: React.FC<IndexProps> = ({ user, selectedPlan, hasPaid, onChoosePlan, onLogout }) => {
  const { login, register, isLoading, upgradePlan } = useAuth();
  const { hasConsented, acceptCookies, declineCookies } = useCookieConsent();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pricingToggle, setPricingToggle] = useState('monthly');
  const [recommendationResult, setRecommendationResult] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState(null);
  const [isUpgrade, setIsUpgrade] = useState(false);
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [showPiAd, setShowPiAd] = useState(false);
  const [showDemoDashboard, setShowDemoDashboard] = useState(false);
  const [selectedDemoPlan, setSelectedDemoPlan] = useState<'Basic' | 'Pro' | 'Premium'>('Basic');
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  const basicFeatures = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Basic Habit Tracking",
      description: "Track up to 5 daily habits with simple streak counters and basic progress visualization.",
      planLevel: "Basic"
    },
    {
      icon: <ClipboardList className="h-8 w-8" />,
      title: "Simple Task Management",
      description: "Create and manage up to 20 tasks with due dates and basic priority levels.",
      planLevel: "Basic"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community Challenges",
      description: "Join public community challenges and view basic leaderboards.",
      planLevel: "Basic"
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Cross-Platform Sync",
      description: "Sync your data across all your devices with automatic cloud backup.",
      planLevel: "Basic"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile App Access",
      description: "Access Salenus A.I on iOS and Android with basic offline functionality.",
      planLevel: "Basic"
    },
    {
      icon: <Wifi className="h-8 w-8" />,
      title: "Basic Notifications",
      description: "Simple push notifications for habit reminders and task deadlines.",
      planLevel: "Basic"
    }
  ];

  const proFeatures = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Mood-Based Suggestions",
      description: "Get personalized task and habit recommendations based on your daily mood tracking.",
      planLevel: "Pro"
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Smart Reminders",
      description: "AI-powered reminders that adapt to your schedule and optimal productivity times.",
      planLevel: "Pro"
    },
    {
      icon: <Star className="h-8 w-8" />,
      title: "Advanced Goal Setting",
      description: "Set complex goals with sub-milestones and automated progress tracking.",
      planLevel: "Pro"
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Progress Photos",
      description: "Document your journey with progress photos and visual habit tracking.",
      planLevel: "Pro"
    },
    {
      icon: <Trophy className="h-8 w-8" />,
      title: "Custom Challenges",
      description: "Create private challenges for friends and track group progress.",
      planLevel: "Pro"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Habit Journal",
      description: "Advanced journaling with templates, tags, and reflection prompts.",
      planLevel: "Pro"
    },
    {
      icon: <Flame className="h-8 w-8" />,
      title: "Streak Protection",
      description: "Protect your streaks with freeze days and recovery modes.",
      planLevel: "Pro"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Priority Support",
      description: "Email support with 24-hour response time and live chat access.",
      planLevel: "Pro"
    }
  ];

  const premiumFeatures = [
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "AI Personal Coach",
      description: "Get personalized coaching sessions and detailed performance analysis from our AI.",
      planLevel: "Premium"
    },
    {
      icon: <PieChart className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Deep insights with trend analysis, correlation tracking, and predictive suggestions.",
      planLevel: "Premium"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Calendar Integration",
      description: "Full integration with Google Calendar, Outlook, and Apple Calendar for seamless scheduling.",
      planLevel: "Premium"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "VIP Support",
      description: "24/7 priority customer support with dedicated account manager and phone support.",
      planLevel: "Premium"
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Exclusive Features",
      description: "Early access to beta features, exclusive workshops, and premium content library.",
      planLevel: "Premium"
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Personalized Courses",
      description: "AI-curated learning paths and skill development courses based on your goals.",
      planLevel: "Premium"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "API Access",
      description: "Developer API access to integrate Salenus A.I with your favorite tools and workflows.",
      planLevel: "Premium"
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "White-Label Options",
      description: "Custom branding and white-label solutions for teams and organizations.",
      planLevel: "Premium"
    }
  ];

  const monthlyPlans = [
    {
      name: "Basic",
      price: "5 Pi",
      features: [
        "Track up to 5 daily habits",
        "Manage up to 20 tasks", 
        "Join community challenges",
        "Cross-platform sync",
        "Mobile app access",
        "Basic notifications",
        "Weekly progress reports",
        "Pi payments integration"
      ],
      limitations: [
        "No mood tracking",
        "No custom challenges",
        "Basic analytics only",
        "Limited support"
      ],
      color: "border-blue-200 bg-blue-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: false
    },
    {
      name: "Pro",
      price: "10 Pi",
      features: [
        "Everything in Basic",
        "Mood-based suggestions",
        "Smart reminders",
        "Advanced goal setting",
        "Progress photos",
        "Custom challenges",
        "Habit journal",
        "Streak protection",
        "Priority support",
        "Advanced analytics"
      ],
      limitations: [
        "No AI coaching",
        "No calendar integration",
        "No API access"
      ],
      color: "border-indigo-200 bg-indigo-50",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700",
      popular: true
    },
    {
      name: "Premium",
      price: "15 Pi",
      features: [
        "Everything in Pro", 
        "AI Personal Coach",
        "Advanced analytics",
        "Calendar integration",
        "Predictive insights",
        "Personalized courses",
        "API access",
        "White-label options",
        "VIP support",
        "Early access to features"
      ],
      limitations: [],
      color: "border-purple-200 bg-purple-50",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      popular: false
    }
  ];

  const yearlyPlans = [
    {
      name: "Basic",
      price: "50 Pi",
      features: [
        "Track up to 5 daily habits",
        "Manage up to 20 tasks",
        "Join community challenges", 
        "Cross-platform sync",
        "Mobile app access",
        "Basic notifications",
        "Weekly progress reports",
        "Pi payments integration",
        "2 months free"
      ],
      limitations: [
        "No mood tracking",
        "No custom challenges", 
        "Basic analytics only",
        "Limited support"
      ],
      color: "border-blue-200 bg-blue-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      popular: false
    },
    {
      name: "Pro",
      price: "100 Pi",
      features: [
        "Everything in Basic",
        "Mood-based suggestions",
        "Smart reminders",
        "Advanced goal setting",
        "Progress photos",
        "Custom challenges",
        "Habit journal",
        "Streak protection",
        "Priority support",
        "Advanced analytics",
        "2 months free"
      ],
      limitations: [
        "No AI coaching",
        "No calendar integration",
        "No API access"
      ],
      color: "border-indigo-200 bg-indigo-50",
      buttonColor: "bg-indigo-600 hover:bg-indigo-700",
      popular: true
    },
    {
      name: "Premium",
      price: "150 Pi",
      features: [
        "Everything in Pro",
        "AI Personal Coach",
        "Advanced analytics",
        "Calendar integration",
        "Predictive insights",
        "Personalized courses",
        "API access",
        "White-label options",
        "VIP support",
        "Early access to features",
        "2 months free"
      ],
      limitations: [],
      color: "border-purple-200 bg-purple-50",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      popular: false
    }
  ];

  const plans = pricingToggle === 'monthly' ? monthlyPlans : yearlyPlans;

  const testimonials = [
    {
      name: "Sarah K.",
      text: "The Pro plan's mood tracking helped me understand my productivity patterns. Game-changer!",
      rating: 5,
      plan: "Pro"
    },
    {
      name: "James L.",
      text: "Premium's AI coach feels like having a personal trainer for my entire life. Worth every Pi!",
      rating: 5,
      plan: "Premium"
    },
    {
      name: "Maria T.",
      text: "Started with Basic, upgraded to Pro after a week. The custom challenges are amazing!",
      rating: 5,
      plan: "Pro"
    },
    {
      name: "Alex R.",
      text: "The Premium analytics showed me patterns I never noticed. My productivity increased 300%!",
      rating: 5,
      plan: "Premium"
    }
  ];

  const handleRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    const recommendations = [
      "Based on your goals, we recommend starting with the Pro plan to access mood tracking and smart reminders.",
      "For maximum productivity, consider the Premium plan with AI coaching and advanced analytics.",
      "The Basic plan is perfect for getting started with habit tracking and task management."
    ];
    const randomRecommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
    setRecommendationResult(randomRecommendation);
  };

  const handleLogin = async (email: string, password: string, plan: any) => {
    try {
      await login(email, password);
      setShowLoginModal(false);
      // After login, redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (email: string, password: string, name: string, plan: any) => {
    try {
      // Use the real Supabase registration from useAuth hook
      await register(email, password, name, plan);
      
      // Close modal and show success message
      setShowLoginModal(false);
      alert('Account created successfully! You are now signed in.');
      
      // After registration, check if user selected a paid plan
      if (plan === 'Free') {
        // Free plan users go directly to dashboard
        navigate('/dashboard');
      } else {
        // Paid plan users go to payment
        navigate('/payment');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error creating account');
    }
  };

  const handleUpgrade = (plan) => {
    setPendingPlan(plan);
    setPaymentOpen(true);
    setIsUpgrade(true);
  };

  const handleRequirePayment = (plan) => {
    setPendingPlan(plan);
    setPaymentOpen(true);
    setIsUpgrade(false);
  };

  const handlePay = async () => {
    setPaymentOpen(false);
    if (isUpgrade && user) {
      await upgradePlan(pendingPlan);
      
      // Show success message
      toast({
        title: "Payment Successful! 🎉",
        description: `Welcome to the ${pendingPlan} plan! You now have access to all premium features.`,
        duration: 4000,
      });
      
      // Redirect to dashboard after payment
      setTimeout(() => {
        console.log('Redirecting to dashboard after payment...');
        window.location.href = '/dashboard';
      }, 1000);
    }
    setPendingPlan(null);
    setIsUpgrade(false);
  };

  const handleChoosePlan = (planName: string) => {
    console.log('Index handleChoosePlan called with:', { planName, user, hasPaid });
    
    if (user) {
      // User is logged in, show upgrade modal
      console.log('User logged in, showing upgrade options');
      navigate('/upgrade');
    } else {
      // User is not logged in, redirect to quick signup
      console.log('User not logged in, redirecting to quick signup');
      navigate('/signup');
    }
    setShowPlanSelection(false);
  };

  const handleGetStarted = (planName: string) => {
    if (user) {
      if (hasPaid) {
        // User has paid, they can access the dashboard
        navigate('/dashboard');
      } else {
        // User is logged in but hasn't paid, show upgrade options
        navigate('/upgrade');
      }
    } else {
      // User is not logged in, redirect to quick signup
      navigate('/signup');
    }
  };

  const handleOpenHabitTracker = () => {
    setShowPiAd(true);
  };

  const handleAdComplete = () => {
    // After ad completion, open the habit tracker
    window.open('https://habittracking8915.pinet.com', '_blank');
  };

  const handleShowDemo = (plan: 'Basic' | 'Pro' | 'Premium') => {
    setSelectedDemoPlan(plan);
    setShowDemoDashboard(true);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-element');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Show cookie consent if user hasn't made a choice yet
  useEffect(() => {
    console.log('Cookie consent state:', hasConsented);
    if (hasConsented === null) {
      console.log('Showing cookie consent banner');
      setShowCookieConsent(true);
    } else {
      console.log('Hiding cookie consent banner');
      setShowCookieConsent(false);
    }
  }, [hasConsented]);

  const handleCookieAccept = (preferences: any) => {
    acceptCookies(preferences);
    setShowCookieConsent(false);
  };

  const handleCookieDecline = () => {
    declineCookies();
    setShowCookieConsent(false);
  };

  // Test function to manually show cookie consent
  const testShowCookieConsent = () => {
    console.log('Manually showing cookie consent');
    setShowCookieConsent(true);
  };

  // Test function to clear cookie consent
  const clearCookieConsent = () => {
    console.log('Clearing cookie consent');
    localStorage.removeItem('salenus_cookie_consent');
    localStorage.removeItem('salenus_cookie_preferences');
    window.location.reload();
  };

  const testAuthentication = async () => {
    console.log('Testing authentication...');
    const connectionTest = await testSupabaseConnection();
    if (connectionTest) {
      const authTest = await testAuthFlow();
      if (authTest) {
        alert('Authentication test passed! Real authentication is working.');
      } else {
        alert('Authentication test failed. Check console for details.');
      }
    } else {
      alert('Connection test failed. Check console for details.');
    }
  };

  if (user && hasPaid) {
    return <UserDashboard user={user} onLogout={onLogout} onUpgrade={handleUpgrade} />;
  }

  return (
    <FooterPageLayout>
      {/* Clean Premium Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg transition-all duration-300 w-full">
        <div className="w-full px-0 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20 px-4 sm:px-0">
            {/* Enhanced Logo Section */}
            <div className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="relative">
                <img src="/logo.png" alt="Salenus A.I Logo" className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full transition-all duration-300 group-hover:scale-110 shadow-lg" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Salenus A.I</span>
                <span className="text-xs sm:text-sm text-gray-500 hidden sm:block">AI Personal Coach</span>
              </div>
            </div>
            
            {/* Enhanced Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <button
                  onClick={testAuthentication}
                  className="relative text-gray-700 hover:text-indigo-600 transition-all duration-300 text-sm font-medium group px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50"
                >
                  <Key className="h-4 w-4 mr-2 inline" />
                  Test Auth
                </button>
                <a href="#features" className="relative text-gray-700 hover:text-indigo-600 transition-all duration-300 text-sm font-medium group px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">
                  <BarChart3 className="h-4 w-4 mr-2 inline" />
                  Features
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#pricing" className="relative text-gray-700 hover:text-indigo-600 transition-all duration-300 text-sm font-medium group px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">
                  <Star className="h-4 w-4 mr-2 inline" />
                  Pricing
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#community" className="relative text-gray-700 hover:text-indigo-600 transition-all duration-300 text-sm font-medium group px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">
                  <Users className="h-4 w-4 mr-2 inline" />
                  Community
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
                <a href="#testimonials" className="relative text-gray-700 hover:text-indigo-600 transition-all duration-300 text-sm font-medium group px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50">
                  <Heart className="h-4 w-4 mr-2 inline" />
                  Testimonials
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
              
                                {/* Enhanced User Section */}
              {user ? (
                <div className="flex items-center space-x-4 ml-8">
                  <div className="hidden xl:flex items-center space-x-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full border border-indigo-100">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-700 font-medium">Welcome, {user.name || user.email}</span>
                  </div>
                  <span className={`text-xs px-3 py-1.5 rounded-full font-medium shadow-sm ${hasPaid ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' : 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border border-orange-200'}`}>
                    {hasPaid ? `${selectedPlan} Plan` : 'Free Account'}
                  </span>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  {!hasPaid && (
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      onClick={() => setShowPlanSelection(true)}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Upgrade
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={onLogout} 
                    className="text-sm border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 hover:scale-105"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-4 ml-8">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-sm border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 hover:scale-105" 
                    onClick={() => { setSelectedDemoPlan('Basic' as const); setShowDemoDashboard(true); }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Demo
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                    onClick={() => setShowLoginModal(true)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              )}
            </nav>

            {/* Enhanced Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 sm:p-3 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 shadow-sm hover:shadow-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Side Drawer Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Side Drawer */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <img src="/logo.png" alt="Salenus A.I Logo" className="h-8 w-8 rounded-full" />
                  <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Menu</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Navigation Links */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Navigation</h3>
                    <a href="#features" className="flex items-center py-4 px-4 text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 group">
                      <BarChart3 className="h-5 w-5 mr-4 text-gray-400 group-hover:text-indigo-600" />
                      <span className="font-semibold text-base">Features</span>
                      <ChevronDown className="h-4 w-4 ml-auto text-gray-400 group-hover:text-indigo-600" />
                    </a>
                    <a href="#pricing" className="flex items-center py-4 px-4 text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 group">
                      <Star className="h-5 w-5 mr-4 text-gray-400 group-hover:text-indigo-600" />
                      <span className="font-semibold text-base">Pricing</span>
                      <ChevronDown className="h-4 w-4 ml-auto text-gray-400 group-hover:text-indigo-600" />
                    </a>
                    <a href="#community" className="flex items-center py-4 px-4 text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 group">
                      <Users className="h-5 w-5 mr-4 text-gray-400 group-hover:text-indigo-600" />
                      <span className="font-semibold text-base">Community</span>
                      <ChevronDown className="h-4 w-4 ml-auto text-gray-400 group-hover:text-indigo-600" />
                    </a>
                    <a href="#testimonials" className="flex items-center py-4 px-4 text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 group">
                      <Heart className="h-5 w-5 mr-4 text-gray-400 group-hover:text-indigo-600" />
                      <span className="font-semibold text-base">Testimonials</span>
                      <ChevronDown className="h-4 w-4 ml-auto text-gray-400 group-hover:text-indigo-600" />
                    </a>
                  </div>
                  
                  {/* User Section */}
                  {user ? (
                    <div className="pt-6 border-t border-gray-200 space-y-4">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Account</h3>
                      <div className="flex items-center space-x-4 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="text-sm text-gray-700">
                          <div className="font-semibold">Welcome back!</div>
                          <div className="text-xs text-gray-500">{user.name || user.email}</div>
                        </div>
                      </div>
                      <div className={`text-sm px-4 py-2 rounded-full inline-block font-medium shadow-sm ${hasPaid ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200' : 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border border-orange-200'}`}>
                        {hasPaid ? `${selectedPlan} Plan` : 'Free Account'}
                      </div>
                      {hasPaid && (
                        <Button 
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 py-4 text-base"
                          onClick={() => window.location.href = '/dashboard'}
                        >
                          <BarChart3 className="h-5 w-5 mr-3" />
                          Access Dashboard
                        </Button>
                      )}
                      {user && (
                        <Button 
                          variant="outline"
                          className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50 transition-all duration-300 py-4 text-base font-semibold"
                          onClick={() => window.location.href = '/dashboard'}
                        >
                          <BarChart3 className="h-5 w-5 mr-3" />
                          Dashboard
                        </Button>
                      )}
                      {!hasPaid && (
                        <Button 
                          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 py-4 text-base"
                          onClick={() => setShowPlanSelection(true)}
                        >
                          <Star className="h-5 w-5 mr-3" />
                          Upgrade Plan
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 py-4 text-base font-semibold" 
                        onClick={onLogout}
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-6 border-t border-gray-200 space-y-4">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Account</h3>
                      <Button 
                        variant="outline"
                        className="w-full border-gray-300 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 py-4 text-base font-semibold" 
                        onClick={() => { setSelectedDemoPlan('Basic' as const); setShowDemoDashboard(true); }}
                      >
                        <User className="h-5 w-5 mr-3" />
                        Try Demo
                      </Button>
                      <Button 
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 py-4 text-base" 
                        onClick={() => navigate('/login')}
                      >
                        <User className="h-5 w-5 mr-3" />
                        Sign In
                      </Button>
                    </div>
                  )}

                  {/* Additional Menu Items */}
                  <div className="pt-6 border-t border-gray-200 space-y-4">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Support</h3>
                    <a href="#help" className="flex items-center py-3 px-4 text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 group">
                      <MessageSquare className="h-5 w-5 mr-4 text-gray-400 group-hover:text-indigo-600" />
                      <span className="font-medium">Help Center</span>
                    </a>
                    <a href="#contact" className="flex items-center py-3 px-4 text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-300 group">
                      <Mail className="h-5 w-5 mr-4 text-gray-400 group-hover:text-indigo-600" />
                      <span className="font-medium">Contact Us</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 sm:p-6 border-t border-gray-200">
                <div className="text-center text-sm text-gray-500">
                  <p>© 2025 Salenus A.I</p>
                  <p className="mt-1">AI Personal Coach</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Original Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 min-h-[80vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Badge className="bg-white/20 text-white border-white/30 mb-4">
              <Pi className="h-4 w-4 mr-2" />
              Pi-Powered AI Personal Coach
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
            Revolutionize Your Life with <span className="text-cyan-300">Salenus A.I</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            The first <span className="font-semibold text-cyan-300">Pi-powered AI coach</span> designed exclusively for the <span className="font-semibold text-cyan-300">Pi Network ecosystem</span>, helping you build habits, achieve goals, and grow personally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            {user ? (
              <>
                <Button
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-gray-100 text-base sm:text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold"
                  onClick={() => navigate('/dashboard')}
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Access Your Dashboard
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/20 text-base sm:text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold backdrop-blur-sm"
                  onClick={() => { setSelectedDemoPlan('Basic' as const); setShowDemoDashboard(true); }}
                >
                  <Play className="h-5 w-5 mr-2" />
                  View Demo
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="lg"
                  className="bg-white text-indigo-600 hover:bg-gray-100 text-base sm:text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold"
                  onClick={() => navigate('/signup')}
                >
                  <User className="h-5 w-5 mr-2" />
                  Create Account
                </Button>
                <Button
                  size="lg"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-base sm:text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-bold"
                  onClick={() => { setSelectedDemoPlan('Basic' as const); setShowDemoDashboard(true); }}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Try Demo
                </Button>
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white text-base sm:text-lg px-6 py-4 rounded-xl transition-all duration-300 hover:scale-105 font-semibold"
                  onClick={() => navigate('/login')}
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              </>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-white/80 mb-6">
            <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">✓ Pi-Powered AI Insights</span>
            <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">✓ Pi Payments Integration</span>
            <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">✓ Pi Network Community</span>
            <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">✓ Pi-Based Rewards</span>
          </div>
          
          {/* Demo Call-to-Action */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Experience Salenus AI First</h3>
              <p className="text-white/80 mb-4">Try our interactive demo to see how AI coaching can transform your habits</p>
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-base px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
                onClick={() => { setSelectedDemoPlan('Basic' as const); setShowDemoDashboard(true); }}
              >
                <Play className="h-5 w-5 mr-2" />
                Launch Interactive Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Floating Section */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {user ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                                  <Button
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 rounded-full p-4"
                    onClick={() => navigate('/dashboard')}
                  >
                    <BarChart3 className="h-6 w-6" />
                  </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Access Dashboard</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white hover:bg-gray-50 text-indigo-600 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 rounded-full p-4"
                  onClick={() => { setSelectedDemoPlan('Basic' as const); setShowDemoDashboard(true); }}
                >
                  <Play className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Try Demo</p>
              </TooltipContent>
            </Tooltip>
          </>
        ) : (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                                  <Button
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 rounded-full p-4"
                    onClick={() => navigate('/signup')}
                  >
                    <User className="h-6 w-6" />
                  </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create Account</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white hover:bg-gray-50 text-indigo-600 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 rounded-full p-4"
                  onClick={() => { setSelectedDemoPlan('Basic' as const); setShowDemoDashboard(true); }}
                >
                  <Play className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Try Demo</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                                  <Button
                    size="lg"
                    variant="ghost"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 rounded-full p-4"
                    onClick={() => navigate('/login')}
                  >
                    <LogIn className="h-6 w-6" />
                  </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign In</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </div>

      {/* Dashboard Access Section for Paid Users */}
      {user && hasPaid && (
        <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome back, {user.name || user.email}! ��
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Your {selectedPlan} plan is active. Access your personalized dashboard to continue your journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold group"
                  onClick={() => navigate('/dashboard')}
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Access Your Dashboard
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
                  onClick={() => setShowDemoDashboard(true)}
                >
                  <Play className="h-5 w-5 mr-2" />
                  View Demo Dashboard
                </Button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-2">
                  {selectedPlan === 'Basic' ? '6' : selectedPlan === 'Pro' ? '14' : '20'}
                </div>
                <div className="text-gray-600">Features Unlocked</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">Active</div>
                <div className="text-gray-600">Plan Status</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">AI Support</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Free User Upgrade Section */}
      {user && !hasPaid && (
        <section className="py-16 bg-gradient-to-r from-orange-50 to-yellow-50 border-b border-orange-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Unlock Your Full Potential, {user.name || user.email}! 🚀
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                You're currently on a free account. Upgrade to unlock advanced AI coaching, unlimited features, and personalized insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold group"
                  onClick={() => setShowPlanSelection(true)}
                >
                  <Star className="h-5 w-5 mr-2" />
                  Choose Your Plan
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
                  onClick={handleOpenHabitTracker}
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Try Free Habit Tracker
                </Button>
              </div>
            </div>
            
            {/* Plan Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">Basic</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">5 Pi/month</div>
                <div className="text-gray-600 mb-4">Perfect for getting started</div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => onChoosePlan && onChoosePlan('Basic', 'monthly')}
                >
                  Start Basic
                </Button>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md text-center border-2 border-indigo-200 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-indigo-600 text-white">Most Popular</Badge>
                </div>
                <div className="text-2xl font-bold text-indigo-600 mb-2">Pro</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">10 Pi/month</div>
                <div className="text-gray-600 mb-4">Advanced features & AI coaching</div>
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  onClick={() => onChoosePlan && onChoosePlan('Pro', 'monthly')}
                >
                  Start Pro
                </Button>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">Premium</div>
                <div className="text-3xl font-bold text-gray-900 mb-2">15 Pi/month</div>
                <div className="text-gray-600 mb-4">Ultimate AI coaching experience</div>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => onChoosePlan && onChoosePlan('Premium', 'monthly')}
                >
                  Start Premium
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 fade-in-element opacity-0 transition-all duration-1000">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Pi-Powered Features for Every Pioneer
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              From basic habit tracking to advanced AI coaching - all powered by the Pi Network ecosystem and paid with Pi.
            </p>
          </div>

          {/* Basic Plan Features */}
          <div className="mb-12 sm:mb-16">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <Badge className="bg-blue-600 text-white text-sm sm:text-lg px-3 sm:px-4 py-2">Basic Plan Features</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {basicFeatures.map((feature, index) => (
                <Card key={index} className="fade-in-element opacity-0 transition-all duration-1000 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                    <div className="mt-4">
                      <Badge className="bg-blue-100 text-blue-800">5 Pi/month</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pro Plan Features */}
          <div className="mb-12 sm:mb-16">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <Badge className="bg-indigo-600 text-white text-sm sm:text-lg px-3 sm:px-4 py-2">Pro Plan Features</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {proFeatures.map((feature, index) => (
                <Card key={index} className="fade-in-element opacity-0 transition-all duration-1000 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                    <div className="mt-4">
                      <Badge className="bg-indigo-100 text-indigo-800">10 Pi/month</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Premium Plan Features */}
          <div className="mb-12 sm:mb-16">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <Badge className="bg-purple-600 text-white text-sm sm:text-lg px-3 sm:px-4 py-2">Premium Plan Features</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {premiumFeatures.map((feature, index) => (
                <Card key={index} className="fade-in-element opacity-0 transition-all duration-1000 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                    <div className="mt-4">
                      <Badge className="bg-purple-100 text-purple-800">15 Pi/month</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pi Network Integration Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-element opacity-0 transition-all duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for the Pi Network Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Salenus A.I is the first AI personal coach designed specifically for Pi Network pioneers, with seamless Pi payments and community integration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="fade-in-element opacity-0 transition-all duration-1000 text-center hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Pi-Powered AI</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced AI coaching powered by the Pi Network infrastructure, providing personalized insights and recommendations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="fade-in-element opacity-0 transition-all duration-1000 text-center hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Pi Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Seamless Pi cryptocurrency payments for all subscriptions and premium features, with instant transactions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="fade-in-element opacity-0 transition-all duration-1000 text-center hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Pi Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with fellow Pi Network pioneers, share achievements, and participate in community challenges.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Free Dashboard Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-element opacity-0 transition-all duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Free Habit Tracker Dashboard
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start building better habits today with our free Pi Network habit tracker. Track up to 5 daily habits with simple streak counters.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Habit Tracker Preview */}
            <div className="fade-in-element opacity-0 transition-all duration-1000">
              <Card className="p-6 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Your Daily Habits</h3>
                    <Badge className="bg-green-100 text-green-800">Free Plan</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">Morning Exercise</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">7 day streak</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">Read 30 minutes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">5 day streak</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="w-10 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Heart className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-medium">Drink 8 glasses water</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">3 day streak</span>
                        <div className="w-16 h-2 bg-gray-200 rounded-full">
                          <div className="w-6 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Weekly Progress</span>
                      <span className="text-sm text-gray-500">75%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="w-3/4 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features and CTA */}
            <div className="fade-in-element opacity-0 transition-all duration-1000">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Free Habit Tracking Features</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Track up to 5 daily habits</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Simple streak counters</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Basic progress visualization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Pi Network integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Weekly progress reports</span>
                </div>
              </div>

              <div className="space-y-4">
                {user ? (
                  <Button 
                    size="lg"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Access Your Dashboard
                  </Button>
                ) : (
                  <Button 
                    size="lg"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl font-semibold"
                    onClick={handleOpenHabitTracker}
                  >
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Open Free Habit Tracker
                  </Button>
                )}
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Ready for more features?</p>
                  <Button 
                    variant="outline"
                    className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => setShowPlanSelection(true)}
                  >
                    Upgrade to Pro
                  </Button>
                </div>
              </div>

              {/* Pi Network Integration */}
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Pi className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Pi Network Integration</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-yellow-700">Pi Pioneer Required</div>
                    <div className="text-xs text-yellow-600">Watch ads to access</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-yellow-700">
                  Join Pi Network to access the free habit tracker and earn Pi rewards
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Dashboard Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-element opacity-0 transition-all duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              See Salenus A.I in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our interactive dashboard demos to see exactly what you'll get with each plan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Basic Plan Demo */}
            <Card className="fade-in-element opacity-0 transition-all duration-1000 hover:shadow-xl hover:-translate-y-2">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-blue-600">Basic Plan</CardTitle>
                <p className="text-gray-600">Perfect for getting started</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">5 habit tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">20 task management</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Community challenges</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Cross-platform sync</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleShowDemo('Basic')}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  View Demo
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan Demo */}
            <Card className="fade-in-element opacity-0 transition-all duration-1000 hover:shadow-xl hover:-translate-y-2 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-indigo-600">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-indigo-600">Pro Plan</CardTitle>
                <p className="text-gray-600">For serious productivity</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Everything in Basic</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Mood tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Advanced goals</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Habit journal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Smart reminders</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleShowDemo('Pro')}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  View Demo
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan Demo */}
            <Card className="fade-in-element opacity-0 transition-all duration-1000 hover:shadow-xl hover:-translate-y-2">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-purple-600">Premium Plan</CardTitle>
                <p className="text-gray-600">AI-powered optimization</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Everything in Pro</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">AI personal coach</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Advanced analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Calendar integration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">VIP support</span>
                  </div>
                </div>
                <Button 
                  onClick={() => handleShowDemo('Premium')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  View Demo
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Click "View Demo" to explore the interactive dashboard for each plan
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user && (
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  size="lg"
                  variant="outline"
                  className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Access Dashboard
                </Button>
              )}
              <Button 
                onClick={() => setShowPlanSelection(true)}
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Choose Your Plan
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 fade-in-element opacity-0 transition-all duration-1000">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Salenus A.I Plan
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              Unlock AI-powered productivity with plans starting at 3 Pi/month. Save up to 17% with yearly billing.
            </p>

            {/* Enhanced Recommendation Tool */}
            <Card className="max-w-2xl mx-auto mb-12">
              <CardHeader>
                <CardTitle className="text-indigo-600">Find Your Perfect Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRecommendation} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="habit-tracking" className="rounded border-gray-300" />
                      <span>Basic habit tracking</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="task-management" className="rounded border-gray-300" />
                      <span>Task management</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="mood-suggestions" className="rounded border-gray-300" />
                      <span>Mood-based suggestions</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="analytics" className="rounded border-gray-300" />
                      <span>Advanced analytics</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="coaching" className="rounded border-gray-300" />
                      <span>AI personal coaching</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="custom-challenges" className="rounded border-gray-300" />
                      <span>Custom challenges</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="api-access" className="rounded border-gray-300" />
                      <span>API access</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="white-label" className="rounded border-gray-300" />
                      <span>White-label options</span>
                    </label>
                  </div>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                    Get Recommendation
                  </Button>
                  {recommendationResult && (
                    <p className="text-indigo-600 font-semibold mt-4">{recommendationResult}</p>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Pricing Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setPricingToggle('monthly')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    pricingToggle === 'monthly' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setPricingToggle('yearly')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    pricingToggle === 'yearly' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Yearly (Save 17%)
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {plans.map((plan, index) => (
              <Card key={plan.name} className={`fade-in-element opacity-0 transition-all duration-1000 relative hover:shadow-xl hover:-translate-y-2 ${plan.popular ? 'ring-2 ring-indigo-600 scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-indigo-600">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900">{plan.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations && plan.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-center space-x-2 opacity-60">
                        <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <span className="text-gray-500 line-through">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-900 hover:bg-gray-800'}`} onClick={() => handleGetStarted(plan.name)}>
                    Get {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-element opacity-0 transition-all duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Join Our Global Community
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with others, share your progress, and stay motivated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="fade-in-element opacity-0 transition-all duration-1000 text-center hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Daily Challenges</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Participate in fun daily challenges to build better habits.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="fade-in-element opacity-0 transition-all duration-1000 text-center hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Leaderboards</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compete with friends and climb the global leaderboard.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="fade-in-element opacity-0 transition-all duration-1000 text-center hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Support Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Join groups to share tips and stay accountable.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 fade-in-element opacity-0 transition-all duration-1000">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Hear from people who've transformed their lives with Salenus A.I across all plan levels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={testimonial.name} className="fade-in-element opacity-0 transition-all duration-1000 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <Badge className={`${testimonial.plan === 'Basic' ? 'bg-blue-100 text-blue-800' : testimonial.plan === 'Pro' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {testimonial.plan}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <p className="font-semibold text-gray-900">– {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={isLoading}
        requirePayment={true}
        onRequirePayment={handleRequirePayment}
      />
      <PaymentModal
        isOpen={paymentOpen}
        plan={pendingPlan}
        onPay={handlePay}
        onChangePlan={() => setPaymentOpen(false)}
        isLoading={isLoading}
      />

      {/* Plan Selection Modal */}
      <Dialog open={showPlanSelection} onOpenChange={setShowPlanSelection}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Choose Your Plan</DialogTitle>
            <p className="text-center text-gray-600">Select the plan that best fits your needs</p>
          </DialogHeader>
          
          {/* Pricing Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setPricingToggle('monthly')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  pricingToggle === 'monthly' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setPricingToggle('yearly')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  pricingToggle === 'yearly' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly (Save 17%)
              </button>
    </div>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <Card key={plan.name} className={`relative hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ${plan.popular ? 'ring-2 ring-indigo-600 scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-indigo-600">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900">{plan.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations && plan.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-center space-x-2 opacity-60">
                        <X className="h-5 w-5 text-red-500 flex-shrink-0" />
                        <span className="text-gray-500 line-through text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-900 hover:bg-gray-800'}`} 
                    onClick={() => handleChoosePlan(plan.name)}
                  >
                    Choose {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Need help choosing? <a href="mailto:support@salenus.ai" className="text-indigo-600 underline">Contact support</a></p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pi Ad Modal */}
      <PiAdModal
        isOpen={showPiAd}
        onClose={() => setShowPiAd(false)}
        onComplete={handleAdComplete}
        adType="video"
        isPiPioneer={true} // Mock value - in real app this would come from user data
      />

      {/* Demo Dashboard Modal */}
      <Dialog open={showDemoDashboard} onOpenChange={setShowDemoDashboard}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0">
          <DialogHeader className="p-4 sm:p-6 pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900">
                  {selectedDemoPlan} Plan Dashboard Demo
                </DialogTitle>
                <p className="text-gray-600 text-sm sm:text-base mt-2">
                  Interactive preview of your Salenus A.I dashboard
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleOpenHabitTracker}
                  className="bg-violet-600 hover:bg-violet-700 text-white text-sm py-2 px-4"
                >
                  Try Free Demo Tracker
                </Button>
                <Button 
                  onClick={() => setShowPlanSelection(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-sm py-2 px-4"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Showcase All Demos Section */}
          <div className="overflow-x-auto overflow-y-hidden">
            <div className="flex flex-nowrap sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 min-w-max sm:min-w-0">
              {(['Basic', 'Pro', 'Premium'] as const).map((plan) => (
                <div key={plan} className="bg-white rounded-xl shadow-lg p-4:p-6 flex flex-col items-center border border-gray-100 min-w-[280px] sm:min-w-0 flex-shrink-0 sm:flex-shrink">
                  <h3 className={`text-lg sm:text-xl font-bold mb-3 text-center ${plan === 'Basic' ? 'text-blue-600' : plan === 'Pro' ? 'text-indigo-600' : 'text-purple-600'}`}>
                    {plan} Plan
                  </h3>
                  <p className="text-gray-600 mb-4 text-center text-sm sm:text-base leading-relaxed flex-1">
                    {plan === 'Basic' && 'Essential habit tracking, task management, and community challenges.'}
                    {plan === 'Pro' && 'Unlock mood tracking, smart reminders, and advanced goals.'}
                    {plan === 'Premium' && 'AI coaching, advanced analytics, and exclusive features.'}
                  </p>
                  <Button
                    className={`w-full text-sm py-3 ${plan === 'Basic' ? 'bg-blue-600 hover:bg-blue-700' : plan === 'Pro' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700'} text-white font-medium`}
                    onClick={() => handleShowDemo(plan)}
                  >
                    View Demo
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Dashboard Content */}
          <div className="overflow-y-auto max-h-[45vh] sm:max-h-[calc(95vh-500)] px-4 pb-6">
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Interactive Dashboard Preview</h4>
              <p className="text-sm text-gray-600 mb-4">
                Explore the features and interface of your selected plan. This is a fully interactive demo of your future dashboard.
              </p>
            </div>
            <DemoDashboard 
              plan={selectedDemoPlan} 
              onUpgrade={() => {
                setShowDemoDashboard(false);
                setShowPlanSelection(true);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Dashboard Button for Paid Users */}
      {user && hasPaid && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 font-semibold group text-sm sm:text-base"
            onClick={() => window.location.href = '/dashboard'}
          >
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Dash</span>
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}

      {/* Cookie Consent Banner */}
      <CookieConsent
        isOpen={showCookieConsent}
        onAccept={handleCookieAccept}
        onDecline={handleCookieDecline}
      />
    </FooterPageLayout>
  );
};

export default Index;
