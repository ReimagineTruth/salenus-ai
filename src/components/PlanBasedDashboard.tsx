import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  ClipboardList, 
  Users, 
  Heart, 
  Brain, 
  Star, 
  Trophy, 
  Target, 
  TrendingUp, 
  Calendar,
  Bell,
  Settings,
  Crown,
  Zap,
  Sparkles,
  CheckCircle,
  Clock,
  Award,
  Lightbulb,
  MessageSquare,
  PieChart,
  Activity,
  Target as TargetIcon,
  BookOpen,
  Camera,
  Shield,
  Globe,
  Smartphone,
  Cloud,
  Database,
  Key,
  Mail,
  Phone,
  Video,
  Users as UsersIcon,
  Star as StarIcon,
  Gift,
  Rocket,
  Diamond,
  Gem,
  Crown as CrownIcon
} from 'lucide-react';
import { UserPlan } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface PlanBasedDashboardProps {
  user: any;
  onUpgrade?: (plan: UserPlan) => void;
}

interface PlanFeatures {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'locked' | 'premium';
  plan: UserPlan;
}

const PlanBasedDashboard: React.FC<PlanBasedDashboardProps> = ({ user, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Plan-specific features and layouts
  const getPlanFeatures = (plan: UserPlan): PlanFeatures[] => {
    const baseFeatures: PlanFeatures[] = [
      {
        title: "Habit Tracking",
        description: "Track daily habits and build streaks",
        icon: <BarChart3 className="h-6 w-6" />,
        status: 'available',
        plan: 'Free'
      },
      {
        title: "Task Management",
        description: "Organize tasks and to-dos",
        icon: <ClipboardList className="h-6 w-6" />,
        status: 'available',
        plan: 'Free'
      },
      {
        title: "Basic Notifications",
        description: "Get reminders and alerts",
        icon: <Bell className="h-6 w-6" />,
        status: 'available',
        plan: 'Free'
      }
    ];

    const basicFeatures: PlanFeatures[] = [
      ...baseFeatures,
      {
        title: "Community Challenges",
        description: "Join challenges and compete",
        icon: <Users className="h-6 w-6" />,
        status: 'available',
        plan: 'Basic'
      },
      {
        title: "Cross-Platform Sync",
        description: "Sync data across devices",
        icon: <Cloud className="h-6 w-6" />,
        status: 'available',
        plan: 'Basic'
      },
      {
        title: "Mobile App Access",
        description: "Access on mobile devices",
        icon: <Smartphone className="h-6 w-6" />,
        status: 'available',
        plan: 'Basic'
      }
    ];

    const proFeatures: PlanFeatures[] = [
      ...basicFeatures,
      {
        title: "Mood Tracking",
        description: "Track your daily mood",
        icon: <Heart className="h-6 w-6" />,
        status: 'available',
        plan: 'Pro'
      },
      {
        title: "Advanced Goals",
        description: "Set and track complex goals",
        icon: <Target className="h-6 w-6" />,
        status: 'available',
        plan: 'Pro'
      },
      {
        title: "Smart Reminders",
        description: "Intelligent notification system",
        icon: <Clock className="h-6 w-6" />,
        status: 'available',
        plan: 'Pro'
      },
      {
        title: "Habit Journal",
        description: "Reflect on your progress",
        icon: <BookOpen className="h-6 w-6" />,
        status: 'available',
        plan: 'Pro'
      },
      {
        title: "Progress Photos",
        description: "Track visual progress",
        icon: <Camera className="h-6 w-6" />,
        status: 'available',
        plan: 'Pro'
      },
      {
        title: "Custom Challenges",
        description: "Create personal challenges",
        icon: <Trophy className="h-6 w-6" />,
        status: 'available',
        plan: 'Pro'
      },
      {
        title: "Streak Protection",
        description: "Protect your streaks",
        icon: <Shield className="h-6 w-6" />,
        status: 'available',
        plan: 'Pro'
      },
      {
        title: "Priority Support",
        description: "Get faster support",
        icon: <MessageSquare className="h-6 w-6" />,
        status: 'available',
        plan: 'Pro'
      }
    ];

    const premiumFeatures: PlanFeatures[] = [
      ...proFeatures,
      {
        title: "AI Personal Coach",
        description: "Get personalized AI guidance",
        icon: <Brain className="h-6 w-6" />,
        status: 'available',
        plan: 'Premium'
      },
      {
        title: "Advanced Analytics",
        description: "Deep insights and reports",
        icon: <PieChart className="h-6 w-6" />,
        status: 'available',
        plan: 'Premium'
      },
      {
        title: "Calendar Integration",
        description: "Sync with your calendar",
        icon: <Calendar className="h-6 w-6" />,
        status: 'available',
        plan: 'Premium'
      },
      {
        title: "VIP Support",
        description: "24/7 dedicated support",
        icon: <Crown className="h-6 w-6" />,
        status: 'available',
        plan: 'Premium'
      },
      {
        title: "Exclusive Features",
        description: "Premium-only features",
        icon: <Diamond className="h-6 w-6" />,
        status: 'available',
        plan: 'Premium'
      },
      {
        title: "Personalized Courses",
        description: "Custom learning paths",
        icon: <GraduationCap className="h-6 w-6" />,
        status: 'available',
        plan: 'Premium'
      },
      {
        title: "API Access",
        description: "Integrate with other apps",
        icon: <Key className="h-6 w-6" />,
        status: 'available',
        plan: 'Premium'
      },
      {
        title: "White Label",
        description: "Custom branding options",
        icon: <Globe className="h-6 w-6" />,
        status: 'available',
        plan: 'Premium'
      }
    ];

    switch (plan) {
      case 'Free':
        return baseFeatures;
      case 'Basic':
        return basicFeatures;
      case 'Pro':
        return proFeatures;
      case 'Premium':
        return premiumFeatures;
      default:
        return baseFeatures;
    }
  };

  const getPlanStats = (plan: UserPlan) => {
    const stats = {
      Free: { habits: 5, tasks: 20, challenges: 0, aiFeatures: 0 },
      Basic: { habits: 15, tasks: 50, challenges: 10, aiFeatures: 0 },
      Pro: { habits: 30, tasks: 100, challenges: 25, aiFeatures: 0 },
      Premium: { habits: 50, tasks: 200, challenges: 50, aiFeatures: 10 }
    };
    return stats[plan] || stats.Free;
  };

  const getPlanColor = (plan: UserPlan) => {
    const colors = {
      Free: 'bg-gray-100 text-gray-800',
      Basic: 'bg-blue-100 text-blue-800',
      Pro: 'bg-purple-100 text-purple-800',
      Premium: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
    };
    return colors[plan] || colors.Free;
  };

  const getPlanIcon = (plan: UserPlan) => {
    const icons = {
      Free: <Star className="h-5 w-5" />,
      Basic: <Target className="h-5 w-5" />,
      Pro: <Zap className="h-5 w-5" />,
      Premium: <Crown className="h-5 w-5" />
    };
    return icons[plan] || icons.Free;
  };

  const handleUpgrade = (targetPlan: UserPlan) => {
    if (onUpgrade) {
      onUpgrade(targetPlan);
    }
  };

  const features = getPlanFeatures(user?.plan || 'Free');
  const stats = getPlanStats(user?.plan || 'Free');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getPlanIcon(user?.plan || 'Free')}
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.plan || 'Free'} Dashboard
              </h1>
            </div>
            <Badge className={getPlanColor(user?.plan || 'Free')}>
              {user?.plan || 'Free'} Plan
            </Badge>
            {/* Add Change Plan button for all except Premium */}
            {user?.plan !== 'Premium' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleUpgrade(user?.plan || 'Free')}
                className="ml-2"
              >
                Change Plan
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('overview')}
              className={activeTab === 'overview' ? 'bg-blue-50 border-blue-200' : ''}
            >
              Overview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('features')}
              className={activeTab === 'features' ? 'bg-blue-50 border-blue-200' : ''}
            >
              Features
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('stats')}
              className={activeTab === 'stats' ? 'bg-blue-50 border-blue-200' : ''}
            >
              Stats
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      Welcome back, {user?.name || user?.email?.split('@')[0] || 'User'}! 🎉
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      You're on the {user?.plan || 'Free'} plan with access to {features.length} features
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {features.filter(f => f.status === 'available').length}
                    </div>
                    <div className="text-sm text-gray-500">Active Features</div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">{stats.habits}</div>
                      <div className="text-sm text-gray-500">Habits</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <ClipboardList className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">{stats.tasks}</div>
                      <div className="text-sm text-gray-500">Tasks</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-8 w-8 text-yellow-600" />
                    <div>
                      <div className="text-2xl font-bold">{stats.challenges}</div>
                      <div className="text-sm text-gray-500">Challenges</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-8 w-8 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold">{stats.aiFeatures}</div>
                      <div className="text-sm text-gray-500">AI Features</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Plan Upgrade CTA */}
            {user?.plan !== 'Premium' && (
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-900">
                        Unlock More Features! 🚀
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Upgrade your plan to access premium features and AI coaching
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => handleUpgrade('Premium')}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade Now
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Your Features</h2>
              <Badge className={getPlanColor(user?.plan || 'Free')}>
                {user?.plan || 'Free'} Plan
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                        <Badge variant="secondary" className="mt-2">
                          {feature.plan} Plan
                        </Badge>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Upgrade Options */}
            {user?.plan !== 'Premium' && (
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">
                    Want More Features?
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Upgrade to unlock advanced features and AI coaching
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {user?.plan === 'Free' && (
                      <Button
                        onClick={() => handleUpgrade('Basic')}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Upgrade to Basic
                      </Button>
                    )}
                    {user?.plan !== 'Pro' && user?.plan !== 'Premium' && (
                      <Button
                        onClick={() => handleUpgrade('Pro')}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Upgrade to Pro
                      </Button>
                    )}
                    <Button
                      onClick={() => handleUpgrade('Premium')}
                      className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Usage</CardTitle>
                  <CardDescription>How you're using your plan features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Habits Tracked</span>
                      <span>{Math.floor(stats.habits * 0.7)}/{stats.habits}</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tasks Completed</span>
                      <span>{Math.floor(stats.tasks * 0.8)}/{stats.tasks}</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Challenges Joined</span>
                      <span>{Math.floor(stats.challenges * 0.6)}/{stats.challenges}</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan Benefits</CardTitle>
                  <CardDescription>What your plan gives you</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Access to {features.length} features</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Up to {stats.habits} habits</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Up to {stats.tasks} tasks</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{stats.challenges} community challenges</span>
                    </div>
                    {stats.aiFeatures > 0 && (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{stats.aiFeatures} AI features</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanBasedDashboard; 