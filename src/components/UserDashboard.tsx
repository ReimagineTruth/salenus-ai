import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  ClipboardList, 
  Users, 
  Star, 
  Heart, 
  Bell, 
  Camera, 
  Trophy, 
  BookOpen, 
  Flame, 
  MessageSquare,
  Sparkles,
  PieChart,
  Calendar,
  Shield,
  Lightbulb,
  GraduationCap,
  Globe,
  Settings,
  LogOut,
  Crown,
  ArrowUp,
  Check
} from 'lucide-react';
import { FeatureCard } from './FeatureCard';
import { useAuth, UserPlan } from '@/hooks/useAuth';

const allFeatures = [
  // Basic Features
  {
    key: 'habit_tracking',
    title: 'Habit Tracking',
    description: 'Track up to 5 daily habits with simple streak counters and basic progress visualization.',
    icon: <BarChart3 className="h-8 w-8" />,
    requiredPlan: 'Basic' as UserPlan
  },
  {
    key: 'task_management',
    title: 'Task Management',
    description: 'Create and manage up to 20 tasks with due dates and basic priority levels.',
    icon: <ClipboardList className="h-8 w-8" />,
    requiredPlan: 'Basic' as UserPlan
  },
  {
    key: 'community_challenges',
    title: 'Community Challenges',
    description: 'Join public community challenges and view basic leaderboards.',
    icon: <Users className="h-8 w-8" />,
    requiredPlan: 'Basic' as UserPlan
  },
  {
    key: 'cross_platform_sync',
    title: 'Cross-Platform Sync',
    description: 'Sync your data across all your devices with automatic cloud backup.',
    icon: <Star className="h-8 w-8" />,
    requiredPlan: 'Basic' as UserPlan
  },
  {
    key: 'mobile_app',
    title: 'Mobile App Access',
    description: 'Access Salenus A.I on iOS and Android with basic offline functionality.',
    icon: <Heart className="h-8 w-8" />,
    requiredPlan: 'Basic' as UserPlan
  },
  {
    key: 'basic_notifications',
    title: 'Basic Notifications',
    description: 'Simple push notifications for habit reminders and task deadlines.',
    icon: <Bell className="h-8 w-8" />,
    requiredPlan: 'Basic' as UserPlan
  },

  // Pro Features
  {
    key: 'mood_tracking',
    title: 'Mood-Based Suggestions',
    description: 'Get personalized task and habit recommendations based on your daily mood tracking.',
    icon: <Heart className="h-8 w-8" />,
    requiredPlan: 'Pro' as UserPlan
  },
  {
    key: 'smart_reminders',
    title: 'Smart Reminders',
    description: 'AI-powered reminders that adapt to your schedule and optimal productivity times.',
    icon: <Bell className="h-8 w-8" />,
    requiredPlan: 'Pro' as UserPlan
  },
  {
    key: 'advanced_goals',
    title: 'Advanced Goal Setting',
    description: 'Set complex goals with sub-milestones and automated progress tracking.',
    icon: <Star className="h-8 w-8" />,
    requiredPlan: 'Pro' as UserPlan
  },
  {
    key: 'progress_photos',
    title: 'Progress Photos',
    description: 'Document your journey with progress photos and visual habit tracking.',
    icon: <Camera className="h-8 w-8" />,
    requiredPlan: 'Pro' as UserPlan
  },
  {
    key: 'custom_challenges',
    title: 'Custom Challenges',
    description: 'Create private challenges for friends and track group progress.',
    icon: <Trophy className="h-8 w-8" />,
    requiredPlan: 'Pro' as UserPlan
  },
  {
    key: 'habit_journal',
    title: 'Habit Journal',
    description: 'Advanced journaling with templates, tags, and reflection prompts.',
    icon: <BookOpen className="h-8 w-8" />,
    requiredPlan: 'Pro' as UserPlan
  },
  {
    key: 'streak_protection',
    title: 'Streak Protection',
    description: 'Protect your streaks with freeze days and recovery modes.',
    icon: <Flame className="h-8 w-8" />,
    requiredPlan: 'Pro' as UserPlan
  },
  {
    key: 'priority_support',
    title: 'Priority Support',
    description: 'Email support with 24-hour response time and live chat access.',
    icon: <MessageSquare className="h-8 w-8" />,
    requiredPlan: 'Pro' as UserPlan
  },

  // Premium Features
  {
    key: 'ai_coaching',
    title: 'AI Personal Coach',
    description: 'Get personalized coaching sessions and detailed performance analysis from our AI.',
    icon: <Sparkles className="h-8 w-8" />,
    requiredPlan: 'Premium' as UserPlan
  },
  {
    key: 'advanced_analytics',
    title: 'Advanced Analytics',
    description: 'Deep insights with trend analysis, correlation tracking, and predictive suggestions.',
    icon: <PieChart className="h-8 w-8" />,
    requiredPlan: 'Premium' as UserPlan
  },
  {
    key: 'calendar_integration',
    title: 'Calendar Integration',
    description: 'Full integration with Google Calendar, Outlook, and Apple Calendar for seamless scheduling.',
    icon: <Calendar className="h-8 w-8" />,
    requiredPlan: 'Premium' as UserPlan
  },
  {
    key: 'predictive_insights',
    title: 'Predictive Insights',
    description: 'AI-powered predictions about your productivity patterns and optimization opportunities.',
    icon: <Lightbulb className="h-8 w-8" />,
    requiredPlan: 'Premium' as UserPlan
  },
  {
    key: 'personalized_courses',
    title: 'Personalized Courses',
    description: 'AI-curated learning paths and skill development courses based on your goals.',
    icon: <GraduationCap className="h-8 w-8" />,
    requiredPlan: 'Premium' as UserPlan
  },
  {
    key: 'api_access',
    title: 'API Access',
    description: 'Developer API access to integrate Salenus A.I with your favorite tools and workflows.',
    icon: <Globe className="h-8 w-8" />,
    requiredPlan: 'Premium' as UserPlan
  },
  {
    key: 'white_label',
    title: 'White-Label Options',
    description: 'Custom branding and white-label solutions for teams and organizations.',
    icon: <Settings className="h-8 w-8" />,
    requiredPlan: 'Premium' as UserPlan
  },
  {
    key: 'vip_support',
    title: 'VIP Support',
    description: '24/7 priority customer support with dedicated account manager and phone support.',
    icon: <Crown className="h-8 w-8" />,
    requiredPlan: 'Premium' as UserPlan
  }
];

export const UserDashboard: React.FC = () => {
  const { user, logout, upgradePlan, hasFeature, isLoading } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Please Sign In</CardTitle>
            <CardDescription className="text-center">
              You need to sign in to access your dashboard
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const availableFeatures = allFeatures.filter(feature => hasFeature(feature.key));
  const lockedFeatures = allFeatures.filter(feature => !hasFeature(feature.key));

  const handleUpgrade = async (newPlan: UserPlan) => {
    await upgradePlan(newPlan);
    setShowUpgradeModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-professional">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold text-slate-800">Salenus A.I Dashboard</span>
              <Badge className={user.plan === 'Premium' ? 'bg-purple-600' : user.plan === 'Pro' ? 'bg-indigo-600' : 'bg-blue-600'}>
                {user.plan} Plan
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                Welcome, {user.name}
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Available Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{availableFeatures.length}</div>
              <Progress value={(availableFeatures.length / allFeatures.length) * 100} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{user.plan}</div>
              <p className="text-sm text-slate-600">Active until {user.planExpiry.toLocaleDateString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Locked Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{lockedFeatures.length}</div>
              <p className="text-sm text-slate-600">Upgrade to unlock</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-slate-600">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Features */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Your Available Features</h2>
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              {availableFeatures.length} Available
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableFeatures.map((feature) => (
              <FeatureCard
                key={feature.key}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                featureKey={feature.key}
                requiredPlan={feature.requiredPlan}
                userPlan={user.plan}
              />
            ))}
          </div>
        </div>

        {/* Locked Features */}
        {lockedFeatures.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Upgrade to Unlock More Features</h2>
              <Button onClick={() => setShowUpgradeModal(true)} className="bg-slate-800 hover:bg-slate-700">
                <ArrowUp className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedFeatures.map((feature) => (
                <FeatureCard
                  key={feature.key}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  featureKey={feature.key}
                  requiredPlan={feature.requiredPlan}
                  userPlan={user.plan}
                  onUpgrade={() => setShowUpgradeModal(true)}
                  isLocked={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Upgrade Your Plan</CardTitle>
              <CardDescription className="text-center">
                Choose a plan to unlock more features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(['Pro', 'Premium'] as UserPlan[]).map((plan) => (
                <div
                  key={plan}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    plan === 'Pro' ? 'border-indigo-200 hover:border-indigo-300' : 'border-purple-200 hover:border-purple-300'
                  }`}
                  onClick={() => handleUpgrade(plan)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={plan === 'Pro' ? 'bg-indigo-600' : 'bg-purple-600'}>
                      {plan}
                    </Badge>
                    <span className="font-bold">{plan === 'Pro' ? '10 Pi' : '15 Pi'}</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {plan === 'Pro' 
                      ? 'Unlock mood tracking, smart reminders, and more'
                      : 'Get AI coaching, advanced analytics, and VIP support'
                    }
                  </p>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowUpgradeModal(false)}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}; 