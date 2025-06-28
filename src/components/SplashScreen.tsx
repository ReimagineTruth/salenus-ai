import React from 'react';
import { Sparkles, Star, Heart, Trophy, Check, ArrowRight, ChevronDown } from 'lucide-react';

const SplashScreen: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-500 text-white flex items-center justify-center">
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

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        {/* Badge */}
        <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-8 animate-fade-in">
          <Sparkles className="h-4 w-4 mr-2" />
          AI-Powered Personal Coach
        </div>

        {/* Logo and Main Heading */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="Salenus A.I Logo" className="h-24 w-24 rounded-full shadow-2xl animate-pulse" />
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Revolutionize Your Life with{" "}
            <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent animate-pulse">
              Salenus A.I
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl lg:text-3xl mb-8 max-w-4xl mx-auto opacity-90 leading-relaxed">
          Your intelligent companion for{" "}
          <span className="font-semibold text-teal-300">habit building</span>,{" "}
          <span className="font-semibold text-purple-300">goal achievement</span>, and{" "}
          <span className="font-semibold text-cyan-300">personal growth</span>
        </p>

        {/* Company Info */}
        <div className="mb-8">
          <h2 className="text-lg sm:text-xl text-white/80 mb-2">by <span className="font-semibold text-white">mrwain organization</span></h2>
          <p className="text-sm text-white/60">Need help? <a href="mailto:support@salenus.ai" className="text-teal-300 underline hover:text-teal-200 transition-colors">support@salenus.ai</a></p>
        </div>

        {/* Features Preview */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 text-sm">
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Check className="h-4 w-4 mr-2 text-green-300" />
            AI-Powered Insights
          </div>
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Check className="h-4 w-4 mr-2 text-green-300" />
            Smart Habit Tracking
          </div>
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Check className="h-4 w-4 mr-2 text-green-300" />
            Personalized Coaching
          </div>
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Check className="h-4 w-4 mr-2 text-green-300" />
            Community Support
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white/60"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-300 absolute top-2 left-2"></div>
            <div className="animate-spin rounded-full h-8 w-8 border-r-2 border-purple-300 absolute top-4 left-4"></div>
          </div>
          <p className="text-white/80 mt-4 text-lg font-medium">Initializing your personalized experience...</p>
          <p className="text-white/60 mt-2 text-sm">Please wait while we set up your account</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 max-w-4xl mx-auto mt-16">
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
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center text-white/60">
          <span className="text-sm mb-2">Preparing your dashboard</span>
          <ChevronDown className="h-6 w-6" />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div className="h-full bg-gradient-to-r from-teal-400 via-purple-400 to-cyan-400 animate-pulse" style={{ width: '100%' }}></div>
      </div>
    </div>
  );
};

export default SplashScreen; 