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
  Brain
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoginModal } from '@/components/LoginModal';
import { UserDashboard } from '@/components/UserDashboard';
import { Link } from 'react-router-dom';
import { PaymentModal } from '@/components/PaymentModal';
import { PiAdModal } from '@/components/PiAdModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DemoDashboard } from '@/components/DemoDashboard';

interface IndexProps {
  user?: any;
  selectedPlan?: string;
  hasPaid?: boolean;
  onChoosePlan?: (plan: string, billing: string) => void;
  onLogout?: () => void;
}

const Index: React.FC<IndexProps> = ({ user, selectedPlan, hasPaid, onChoosePlan, onLogout }) => {
  const { login, isLoading, upgradePlan } = useAuth();
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
    await login(email, password, plan);
    setShowLoginModal(false);
    setPendingPlan(plan);
    setPaymentOpen(true);
    setIsUpgrade(false);
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
    }
    setPendingPlan(null);
    setIsUpgrade(false);
  };

  const handleChoosePlan = (planName: string) => {
    if (onChoosePlan) {
      onChoosePlan(planName, pricingToggle);
    }
    setShowPlanSelection(false);
  };

  const handleGetStarted = (planName: string) => {
    if (user) {
      if (hasPaid) {
        // User has paid, they can access the dashboard
        // This would typically redirect to dashboard
        console.log('User has paid, accessing dashboard');
    } else {
        // User is logged in but hasn't paid, choose a plan
        if (onChoosePlan) {
          onChoosePlan(planName, pricingToggle);
    }
      }
    } else {
      // User is not logged in, show login modal
      setShowLoginModal(true);
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

  if (user && hasPaid) {
    return <UserDashboard user={user} onLogout={onLogout} onUpgrade={handleUpgrade} />;
  }

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Salenus A.I Logo" className="h-10 w-10 rounded-full" />
              <span className="text-2xl font-bold text-indigo-600">Salenus A.I</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-indigo-600 transition-colors">Pricing</a>
              <a href="#community" className="text-gray-700 hover:text-indigo-600 transition-colors">Community</a>
              <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 transition-colors">Testimonials</a>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, {user.name || user.email}</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${hasPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {hasPaid ? `${selectedPlan} Plan` : 'Free Account'}
                    </span>
                    {hasPaid && (
                      <span className="text-xs text-green-600">✓ Active</span>
                    )}
                  </div>
                  {hasPaid && (
                    <Button 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => window.location.href = '/dashboard'}
                    >
                      Dashboard
                    </Button>
                  )}
                  {!hasPaid && (
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => setShowPlanSelection(true)}
                    >
                      Upgrade Plan
                    </Button>
                  )}
                  <Button variant="outline" onClick={onLogout}>Logout</Button>
                </div>
              ) : (
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowLoginModal(true)}>Sign In</Button>
              )}
            </nav>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-2">
              <a href="#features" className="block py-2 text-gray-700 hover:text-indigo-600">Features</a>
              <a href="#pricing" className="block py-2 text-gray-700 hover:text-indigo-600">Pricing</a>
              <a href="#community" className="block py-2 text-gray-700 hover:text-indigo-600">Community</a>
              <a href="#testimonials" className="block py-2 text-gray-700 hover:text-indigo-600">Testimonials</a>
              {user ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Welcome, {user.name || user.email}</div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${hasPaid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {hasPaid ? `${selectedPlan} Plan` : 'Free Account'}
                  </div>
                  {hasPaid && (
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => window.location.href = '/dashboard'}
                    >
                      Dashboard
                    </Button>
                  )}
                  {!hasPaid && (
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={() => setShowPlanSelection(true)}
                    >
                      Upgrade Plan
                    </Button>
                  )}
                  <Button variant="outline" className="w-full" onClick={onLogout}>Logout</Button>
                </div>
              ) : (
                <Button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700" onClick={() => setShowLoginModal(true)}>Sign In</Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-500 text-white min-h-screen flex items-center justify-center pt-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-bounce delay-1000">
            <Sparkles className="h-8 w-8 text-white/30" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-bounce delay-2000">
            <Star className="h-6 w-6 text-white/20" />
          </div>
          <div className="absolute bottom-1/3 left-1/3 animate-bounce delay-1500">
            <Heart className="h-7 w-7 text-white/25" />
          </div>
          <div className="absolute bottom-1/4 right-1/3 animate-bounce delay-3000">
            <Trophy className="h-8 w-8 text-white/30" />
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center justify-center">
          <div className="text-center fade-in-element opacity-0 transition-all duration-1000 flex flex-col items-center justify-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4 mr-2" />
              Pi-Powered AI Personal Coach
            </div>
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              Revolutionize Your Life with{" "}
              <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent animate-pulse">
                Salenus A.I
              </span>
            </h1>
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl lg:text-3xl mb-8 max-w-4xl mx-auto opacity-90 leading-relaxed">
              The first <span className="font-semibold text-teal-300">Pi-powered AI coach</span> designed exclusively for the{" "}
              <span className="font-semibold text-purple-300">Pi Network ecosystem</span>, helping you build habits, achieve goals, and grow personally
            </p>
            {/* Features Preview */}
            <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Check className="h-4 w-4 mr-2 text-green-300" />
                Pi-Powered AI Insights
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Check className="h-4 w-4 mr-2 text-green-300" />
                Pi Payments Integration
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Check className="h-4 w-4 mr-2 text-green-300" />
                Pi Network Community
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Check className="h-4 w-4 mr-2 text-green-300" />
                Pi-Based Rewards
              </div>
            </div>
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {user ? (
                hasPaid ? (
                  <Button 
                    size="lg" 
                    className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-semibold group"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    Access Your Dashboard
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-semibold group"
                      onClick={() => setShowPlanSelection(true)}
                    >
              Choose Your Plan
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-semibold group"
                      onClick={handleOpenHabitTracker}
                    >
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Open Free Habit Tracker
            </Button>
                  </div>
                )
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-semibold group"
                    onClick={() => window.open('https://minepi.com/Wain2020', '_blank')}
                  >
                    Start Your Pi Journey
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button 
                    size="lg" 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-6 rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-semibold group"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Watch Demo
                  </Button>
                </>
              )}
            </div>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 max-w-4xl mx-auto mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-300 mb-2">500K+</div>
                <div className="text-white/80">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-300 mb-2">95%</div>
                <div className="text-white/80">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-300 mb-2">24/7</div>
                <div className="text-white/80">AI Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">1M+</div>
                <div className="text-white/80">Habits Tracked</div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-4xl mx-auto">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Trusted by Pi Network Pioneers Worldwide</h3>
                <p className="text-white/80 text-sm">Join the fastest-growing AI coaching community in the Pi ecosystem</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-300 mb-1">150+</div>
                  <div className="text-white/70 text-sm">Countries</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-300 mb-1">50+</div>
                  <div className="text-white/70 text-sm">Languages</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-300 mb-1">4.9★</div>
                  <div className="text-white/70 text-sm">User Rating</div>
                </div>
              </div>
            </div>

            {/* Enhanced Features Preview */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Users className="h-4 w-4 mr-2 text-green-300" />
                500K+ Pi Pioneers
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Star className="h-4 w-4 mr-2 text-yellow-300" />
                4.9/5 Rating
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Trophy className="h-4 w-4 mr-2 text-purple-300" />
                #1 Pi AI Coach
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Shield className="h-4 w-4 mr-2 text-blue-300" />
                Verified AI
              </div>
            </div>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center text-white/60">
            <span className="text-sm mb-2">Scroll to explore</span>
            <ChevronDown className="h-6 w-6" />
          </div>
        </div>
      </section>

      {/* Dashboard Access Section for Paid Users */}
      {user && hasPaid && (
        <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome back, {user.name || user.email}! 🎉
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Your {selectedPlan} plan is active. Access your personalized dashboard to continue your journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold group"
                  onClick={() => window.location.href = '/dashboard'}
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
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-element opacity-0 transition-all duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Pi-Powered Features for Every Pioneer
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From basic habit tracking to advanced AI coaching - all powered by the Pi Network ecosystem and paid with Pi.
            </p>
          </div>

          {/* Basic Plan Features */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <Badge className="bg-blue-600 text-white text-lg px-4 py-2">Basic Plan Features</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <Badge className="bg-indigo-600 text-white text-lg px-4 py-2">Pro Plan Features</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <Badge className="bg-purple-600 text-white text-lg px-4 py-2">Premium Plan Features</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Button 
                  size="lg"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 px-6 rounded-xl font-semibold"
                  onClick={handleOpenHabitTracker}
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Open Free Habit Tracker
                </Button>
                
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
            <Button 
              onClick={() => setShowPlanSelection(true)}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Choose Your Plan
            </Button>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-element opacity-0 transition-all duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Salenus A.I Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-element opacity-0 transition-all duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from people who've transformed their lives with Salenus A.I across all plan levels.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* Footer */}
      <footer className="bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="fade-in-element opacity-0 transition-all duration-1000 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src="/logo.png" alt="Salenus A.I Logo" className="h-8 w-8 rounded-full" />
                <span className="text-2xl font-bold">Salenus A.I</span>
                </div>
              <p className="text-white/80 mb-4">
                Revolutionize your life with Salenus A.I, your AI personal assistant for productivity and habit transformation.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-blue-300 transition"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-200 transition"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
                <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-blue-100 transition"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-300 transition"><svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z"/></svg></a>
            </div>
            </div>
            <div className="fade-in-element opacity-0 transition-all duration-1000">
              <h3 className="text-lg font-semibold mb-4">Explore</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#community" className="text-white/80 hover:text-white transition-colors">Community</a></li>
                <li><a href="#testimonials" className="text-white/80 hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div className="fade-in-element opacity-0 transition-all duration-1000">
              <h3 className="text-lg font-semibold mb-4">Legal & Info</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-white/80 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-white/80 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/about" className="text-white/80 hover:text-white transition-colors">About</Link></li>
                <li><Link to="/cookies" className="text-white/80 hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
            <div className="fade-in-element opacity-0 transition-all duration-1000">
              <h3 className="text-lg font-semibold mb-4">Help & Community</h3>
              <ul className="space-y-2">
                <li><Link to="/tutorial" className="text-white/80 hover:text-white transition-colors">Tutorial</Link></li>
                <li><Link to="/wiki" className="text-white/80 hover:text-white transition-colors">Community Wiki</Link></li>
              </ul>
            </div>
            <div className="fade-in-element opacity-0 transition-all duration-1000 md:col-span-1 flex flex-col justify-between">
              <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
              <p className="text-white/80 mb-4">Subscribe to our newsletter for updates and exclusive tips.</p>
              <form className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-3 py-2 rounded-md text-gray-900"
                />
                <button className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-md font-semibold transition-colors">Subscribe</button>
              </form>
              <span className="text-xs text-white/60 mt-2">No spam. Unsubscribe anytime.</span>
              </div>
            </div>
          <div className="border-t border-white/20 mt-12 pt-8 text-center">
            <p className="text-white/80">© 2025 Salenus A.I by mrwain organization. All Rights Reserved.</p>
            <p className="text-white/60 text-sm mt-2">Need help? <a href="mailto:support@salenus.ai" className="underline">support@salenus.ai</a></p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
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
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {selectedDemoPlan} Plan Dashboard Demo
                </DialogTitle>
                <p className="text-gray-600">
                  Interactive preview of your Salenus A.I dashboard
                </p>
              </div>
              <Button 
                onClick={() => setShowPlanSelection(true)}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Get Started
              </Button>
            </div>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
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
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 font-semibold group"
            onClick={() => window.location.href = '/dashboard'}
          >
            <BarChart3 className="h-5 w-5 mr-2" />
            Dashboard
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      )}
    </>
  );
};

export default Index;
