import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckIcon, 
  ChartBarIcon, 
  ClipboardDocumentListIcon, 
  UsersIcon, 
  StarIcon, 
  LightBulbIcon, 
  CloudIcon, 
  CogIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Index = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [recommendationResult, setRecommendationResult] = useState('');

  const features = [
    {
      icon: <ChartBarIcon className="h-8 w-8" />,
      title: "AI Habit Tracking",
      description: "Track and improve your habits with intelligent insights powered by AI."
    },
    {
      icon: <ClipboardDocumentListIcon className="h-8 w-8" />,
      title: "Task Management",
      description: "Organize your tasks with smart reminders and prioritization."
    },
    {
      icon: <UsersIcon className="h-8 w-8" />,
      title: "Community Challenges",
      description: "Join global challenges to stay motivated and connected."
    },
    {
      icon: <StarIcon className="h-8 w-8" />,
      title: "Goal Setting",
      description: "Define and track long-term goals with personalized milestones."
    },
    {
      icon: <LightBulbIcon className="h-8 w-8" />,
      title: "Daily Insights",
      description: "Get AI-driven summaries of your progress and actionable tips."
    },
    {
      icon: <CloudIcon className="h-8 w-8" />,
      title: "Offline Mode",
      description: "Use core features without an internet connection."
    },
    {
      icon: <CogIcon className="h-8 w-8" />,
      title: "Third-Party Integrations", 
      description: "Sync with apps like Google Calendar and Todoist for seamless workflows."
    }
  ];

  const monthlyPlans = [
    {
      name: "Basic",
      price: "3 Pi",
      usdPrice: "~ $1.76 USD",
      features: [
        "AI Habit Tracking",
        "Basic Task Management", 
        "Community Challenges",
        "Cross-Platform Sync",
        "Pi Payments"
      ]
    },
    {
      name: "Pro",
      price: "6 Pi",
      usdPrice: "~ $3.52 USD",
      features: [
        "Everything in Basic",
        "Mood-Based Suggestions",
        "Advanced Task Prioritization",
        "Priority Support",
        "Custom Challenge Creation"
      ],
      popular: true
    },
    {
      name: "Premium",
      price: "12 Pi",
      usdPrice: "~ $7.04 USD",
      features: [
        "Everything in Pro",
        "Personalized AI Coaching",
        "Advanced Analytics Dashboard",
        "Exclusive Community Events",
        "Early Access to New Features"
      ]
    }
  ];

  const yearlyPlans = [
    {
      name: "Basic",
      price: "30 Pi",
      usdPrice: "~ $17.61 USD",
      features: [
        "AI Habit Tracking",
        "Basic Task Management",
        "Community Challenges", 
        "Cross-Platform Sync",
        "Pi Payments"
      ]
    },
    {
      name: "Pro",
      price: "60 Pi",
      usdPrice: "~ $35.22 USD",
      features: [
        "Everything in Basic",
        "Mood-Based Suggestions",
        "Advanced Task Prioritization",
        "Priority Support",
        "Custom Challenge Creation"
      ],
      popular: true
    },
    {
      name: "Premium",
      price: "120 Pi",
      usdPrice: "~ $70.44 USD",
      features: [
        "Everything in Pro",
        "Personalized AI Coaching",
        "Advanced Analytics Dashboard",
        "Exclusive Community Events",
        "Early Access to New Features"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Sarah K.",
      text: "Gen helped me stay on track with my fitness goals. The AI insights are a game-changer!",
      rating: 5
    },
    {
      name: "James L.",
      text: "The community challenges keep me motivated. I've never been this productive!",
      rating: 5
    },
    {
      name: "Maria T.",
      text: "Paying with Pi is so easy, and the app is worth every coin.",
      rating: 5
    }
  ];

  const handleRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const needs = {
      habitTracking: formData.has('habit-tracking'),
      taskManagement: formData.has('task-management'),
      moodSuggestions: formData.has('mood-suggestions'),
      analytics: formData.has('analytics')
    };

    let recommendation = 'Basic';
    if (needs.analytics) {
      recommendation = 'Premium';
    } else if (needs.moodSuggestions) {
      recommendation = 'Pro';
    } else if (needs.habitTracking || needs.taskManagement) {
      recommendation = 'Basic';
    }

    setRecommendationResult(`We recommend the ${recommendation} plan. Check it out below!`);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold text-indigo-600">Gen</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-indigo-600 transition-colors">Pricing</a>
              <a href="#community" className="text-gray-700 hover:text-indigo-600 transition-colors">Community</a>
              <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 transition-colors">Testimonials</a>
              <Button className="bg-indigo-600 hover:bg-indigo-700">Sign In</Button>
            </nav>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
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
              <Button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700">Sign In</Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center fade-in-element opacity-0 transition-all duration-1000">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Revolutionize Your Life with <span className="text-teal-300">Gen</span>
            </h1>
            <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Your AI-powered personal assistant to transform habits, manage tasks, and connect with a global community.
            </p>
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-element opacity-0 transition-all duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Gen?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover powerful features to boost your productivity and well-being.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="fade-in-element opacity-0 transition-all duration-1000 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="text-indigo-600 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-element opacity-0 transition-all duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Gen Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Unlock AI-powered productivity with plans starting at 3 Pi/month. Save up to 17% with yearly billing.
            </p>

            {/* Recommendation Tool */}
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
                      <span>Simple task management</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="mood-suggestions" className="rounded border-gray-300" />
                      <span>Mood-based suggestions</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" name="analytics" className="rounded border-gray-300" />
                      <span>In-depth analytics</span>
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
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    selectedPlan === 'monthly' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-6 py-2 rounded-md font-medium transition-colors ${
                    selectedPlan === 'yearly' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Yearly (Save 17%)
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(selectedPlan === 'monthly' ? monthlyPlans : yearlyPlans).map((plan, index) => (
              <Card key={index} className={`fade-in-element opacity-0 transition-all duration-1000 relative hover:shadow-xl hover:-translate-y-2 ${plan.popular ? 'ring-2 ring-indigo-600 scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-indigo-600">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-gray-900">{plan.price}</div>
                  <p className="text-sm text-gray-500">{plan.usdPrice}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-900 hover:bg-gray-800'}`}>
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
                  <StarIcon className="h-8 w-8 text-white" />
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
                  <ChartBarIcon className="h-8 w-8 text-white" />
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
                  <UsersIcon className="h-8 w-8 text-white" />
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in-element opacity-0 transition-all duration-1000">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from people who've transformed their lives with Gen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="fade-in-element opacity-0 transition-all duration-1000 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="fade-in-element opacity-0 transition-all duration-1000">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <span className="text-2xl font-bold">Gen</span>
              </div>
              <p className="text-white/80">
                Revolutionize your life with Gen, your AI personal assistant for productivity and habit transformation.
              </p>
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
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-white/80 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div className="fade-in-element opacity-0 transition-all duration-1000">
              <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
              <p className="text-white/80 mb-4">Subscribe to our newsletter for updates.</p>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-3 py-2 rounded-md text-gray-900"
                />
                <Button className="bg-white text-indigo-600 hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-8 text-center">
            <p className="text-white/80">© 2025 Gen. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
