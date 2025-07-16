import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart3, 
  ClipboardList, 
  Users, 
  Cloud, 
  Smartphone, 
  Bell, 
  Heart, 
  Sparkles, 
  Star, 
  Camera, 
  Trophy, 
  BookOpen, 
  Flame, 
  MessageSquare, 
  PieChart, 
  Calendar, 
  Shield, 
  Lightbulb, 
  GraduationCap, 
  Globe, 
  Settings, 
  Lock,
  Plus,
  TrendingUp,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  Crown,
  Zap,
  ArrowRight,
  LogOut,
  User,
  Settings as SettingsIcon,
  HelpCircle,
  Info
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PaymentModal } from '@/components/PaymentModal';
import { useToast } from '@/hooks/use-toast';

interface HomeDashboardProps {
  user?: any;
  onLogout?: () => void;
  onUpgrade?: (plan: string) => void;
}

interface UserData {
  habits: Array<{
    id: string;
    name: string;
    category: string;
    streak: number;
    completed: boolean;
    target: number;
    current: number;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in-progress' | 'completed';
    dueDate: string;
    category: string;
  }>;
  challenges: Array<{
    id: string;
    name: string;
    description: string;
    progress: number;
    target: number;
    current: number;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
  stats: {
    totalHabits: number;
    completedHabits: number;
    totalTasks: number;
    completedTasks: number;
    activeChallenges: number;
    currentStreak: number;
    longestStreak: number;
    totalPoints: number;
  };
  lastSync: string;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'reminder' | 'achievement' | 'challenge' | 'system';
    read: boolean;
    timestamp: string;
  }>;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ user, onLogout, onUpgrade }) => {
  const { upgradePlan, isLoading, hasFeature } = useAuth();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Check if user has a plan, if not default to Free
  const userPlan = user?.plan || 'Free';
  const hasPaid = user?.hasPaid || false;

  // Initialize user data from localStorage or create default data
  useEffect(() => {
    const initializeUserData = () => {
      const savedData = localStorage.getItem(`userData_${user?.id}`);
      
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setUserData(parsedData);
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          createDefaultUserData();
        }
      } else {
        createDefaultUserData();
      }
      
      setIsLoadingData(false);
    };

    const createDefaultUserData = () => {
      const defaultData: UserData = {
        habits: [
          {
            id: '1',
            name: 'Morning Exercise',
            category: 'Health',
            streak: 5,
            completed: false,
            target: 1,
            current: 0
          },
          {
            id: '2',
            name: 'Read 30 minutes',
            category: 'Learning',
            streak: 3,
            completed: false,
            target: 1,
            current: 0
          },
          {
            id: '3',
            name: 'Drink 8 glasses of water',
            category: 'Health',
            streak: 7,
            completed: false,
            target: 8,
            current: 0
          }
        ],
        tasks: [
          {
            id: '1',
            title: 'Complete project proposal',
            description: 'Finish the quarterly project proposal document',
            priority: 'high',
            status: 'pending',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'Work'
          },
          {
            id: '2',
            title: 'Grocery shopping',
            description: 'Buy groceries for the week',
            priority: 'medium',
            status: 'pending',
            dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            category: 'Personal'
          }
        ],
        challenges: [
          {
            id: '1',
            name: '30-Day Fitness Challenge',
            description: 'Complete 30 days of consistent exercise',
            progress: 60,
            target: 30,
            current: 18,
            category: 'Health',
            difficulty: 'medium'
          }
        ],
        stats: {
          totalHabits: 3,
          completedHabits: 0,
          totalTasks: 2,
          completedTasks: 0,
          activeChallenges: 1,
          currentStreak: 5,
          longestStreak: 12,
          totalPoints: 450
        },
        lastSync: new Date().toISOString(),
        notifications: [
          {
            id: '1',
            title: 'Welcome to Salenus AI!',
            message: 'Start your journey by completing your first habit today.',
            type: 'system',
            read: false,
            timestamp: new Date().toISOString()
          }
        ]
      };
      
      setUserData(defaultData);
      if (user?.id) {
        localStorage.setItem(`userData_${user.id}`, JSON.stringify(defaultData));
      }
    };

    if (user?.id) {
      initializeUserData();
    }
  }, [user?.id]);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (userData && user?.id) {
      localStorage.setItem(`userData_${user.id}`, JSON.stringify(userData));
    }
  }, [userData, user?.id]);

  // Check if subscription is expired
  const isExpired = user && user.planExpiry && new Date(user.planExpiry) < new Date();
  const isExpiringSoon = user && user.planExpiry && !isExpired && 
    new Date(user.planExpiry).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;

  // Handle plan upgrade
  const handleUpgrade = (plan: string) => {
    setSelectedPlan(plan);
    setPaymentOpen(true);
  };

  const handlePay = async () => {
    if (!selectedPlan) return;
    
    try {
      await upgradePlan(selectedPlan);
      setPaymentOpen(false);
      toast({
        title: "Plan Upgraded!",
        description: `Successfully upgraded to ${selectedPlan} plan.`,
      });
    } catch (error) {
      toast({
        title: "Upgrade Failed",
        description: "Failed to upgrade plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleChangePlan = () => {
    setPaymentOpen(false);
  };

  // Handle habit completion
  const handleHabitComplete = (habitId: string) => {
    if (!userData) return;
    
    setUserData(prev => {
      if (!prev) return prev;
      
      const updatedHabits = prev.habits.map(habit => 
        habit.id === habitId 
          ? { ...habit, completed: true, current: habit.current + 1, streak: habit.streak + 1 }
          : habit
      );
      
      const updatedStats = {
        ...prev.stats,
        completedHabits: updatedHabits.filter(h => h.completed).length,
        totalPoints: prev.stats.totalPoints + 10
      };
      
      return {
        ...prev,
        habits: updatedHabits,
        stats: updatedStats
      };
    });
  };

  // Handle task completion
  const handleTaskComplete = (taskId: string) => {
    if (!userData) return;
    
    setUserData(prev => {
      if (!prev) return prev;
      
      const updatedTasks = prev.tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed' as const }
          : task
      );
      
      const updatedStats = {
        ...prev.stats,
        completedTasks: updatedTasks.filter(t => t.status === 'completed').length,
        totalPoints: prev.stats.totalPoints + 15
      };
      
      return {
        ...prev,
        tasks: updatedTasks,
        stats: updatedStats
      };
    });
  };

  // Get plan features based on user's plan
  const getPlanFeatures = () => {
    const features = {
      Free: [
        { name: 'Free Habit Preview', icon: BarChart3, available: true },
        { name: 'Pi Network Integration', icon: Users, available: true },
        { name: 'Basic Habit Tracking', icon: Lock, available: false },
        { name: 'Task Management', icon: Lock, available: false },
        { name: 'Community Challenges', icon: Lock, available: false }
      ],
      Basic: [
        { name: 'Habit Tracking', icon: BarChart3, available: true },
        { name: 'Task Management', icon: ClipboardList, available: true },
        { name: 'Community Challenges', icon: Users, available: true },
        { name: 'Cross-Platform Sync', icon: Cloud, available: true },
        { name: 'Mobile App Access', icon: Smartphone, available: true },
        { name: 'Basic Notifications', icon: Bell, available: true },
        { name: 'Mood Tracking', icon: Lock, available: false },
        { name: 'Smart Reminders', icon: Lock, available: false }
      ],
      Pro: [
        { name: 'Habit Tracking', icon: BarChart3, available: true },
        { name: 'Task Management', icon: ClipboardList, available: true },
        { name: 'Community Challenges', icon: Users, available: true },
        { name: 'Cross-Platform Sync', icon: Cloud, available: true },
        { name: 'Mobile App Access', icon: Smartphone, available: true },
        { name: 'Basic Notifications', icon: Bell, available: true },
        { name: 'Mood Tracking', icon: Heart, available: true },
        { name: 'Smart Reminders', icon: Bell, available: true },
        { name: 'Advanced Goals', icon: Star, available: true },
        { name: 'Progress Photos', icon: Camera, available: true },
        { name: 'Custom Challenges', icon: Trophy, available: true },
        { name: 'Habit Journal', icon: BookOpen, available: true },
        { name: 'Streak Protection', icon: Flame, available: true },
        { name: 'Priority Support', icon: MessageSquare, available: true },
        { name: 'AI Coaching', icon: Lock, available: false },
        { name: 'Advanced Analytics', icon: Lock, available: false }
      ],
      Premium: [
        { name: 'Habit Tracking', icon: BarChart3, available: true },
        { name: 'Task Management', icon: ClipboardList, available: true },
        { name: 'Community Challenges', icon: Users, available: true },
        { name: 'Cross-Platform Sync', icon: Cloud, available: true },
        { name: 'Mobile App Access', icon: Smartphone, available: true },
        { name: 'Basic Notifications', icon: Bell, available: true },
        { name: 'Mood Tracking', icon: Heart, available: true },
        { name: 'Smart Reminders', icon: Bell, available: true },
        { name: 'Advanced Goals', icon: Star, available: true },
        { name: 'Progress Photos', icon: Camera, available: true },
        { name: 'Custom Challenges', icon: Trophy, available: true },
        { name: 'Habit Journal', icon: BookOpen, available: true },
        { name: 'Streak Protection', icon: Flame, available: true },
        { name: 'Priority Support', icon: MessageSquare, available: true },
        { name: 'AI Coaching', icon: Sparkles, available: true },
        { name: 'Advanced Analytics', icon: PieChart, available: true },
        { name: 'Calendar Integration', icon: Calendar, available: true },
        { name: 'VIP Support', icon: Shield, available: true },
        { name: 'Exclusive Features', icon: Lightbulb, available: true },
        { name: 'Personalized Courses', icon: GraduationCap, available: true },
        { name: 'API Access', icon: Globe, available: true },
        { name: 'White-Label Options', icon: Settings, available: true }
      ]
    };
    
    return features[userPlan as keyof typeof features] || features.Free;
  };

  if (isLoadingData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">Salenus AI</span>
              </div>
              <Badge variant={userPlan === 'Premium' ? 'default' : userPlan === 'Pro' ? 'secondary' : 'outline'} className="ml-2">
                {userPlan} Plan
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900">{user.name || user.email}</p>
                  <p className="text-xs text-slate-500">{userPlan} Plan</p>
                </div>
              </div>
              
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user.name || user.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-slate-600">
            Ready to continue your journey? Here's what's happening today.
          </p>
        </div>

        {/* Plan Status Banner */}
        {isExpired && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Subscription Expired</h3>
                <p className="text-sm text-red-700">Your {userPlan} plan has expired. Renew to continue accessing all features.</p>
              </div>
              <Button size="sm" className="ml-auto" onClick={() => handleUpgrade(userPlan)}>
                Renew Plan
              </Button>
            </div>
          </div>
        )}

        {isExpiringSoon && !isExpired && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Subscription Expiring Soon</h3>
                <p className="text-sm text-yellow-700">Your {userPlan} plan expires in {Math.ceil((new Date(user.planExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days.</p>
              </div>
              <Button size="sm" className="ml-auto" onClick={() => handleUpgrade(userPlan)}>
                Renew Now
              </Button>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        {userData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Points</CardTitle>
                <Zap className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.stats.totalPoints}</div>
                <p className="text-xs text-muted-foreground">
                  +{userData.stats.totalPoints - 400} from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <Flame className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.stats.currentStreak} days</div>
                <p className="text-xs text-muted-foreground">
                  Longest: {userData.stats.longestStreak} days
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Challenges</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.stats.activeChallenges}</div>
                <p className="text-xs text-muted-foreground">
                  {userData.challenges.length} total challenges
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData.stats.completedTasks}</div>
                <p className="text-xs text-muted-foreground">
                  {userData.stats.totalTasks} total tasks
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Today's Habits */}
        {userData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Today's Habits
                </CardTitle>
                <CardDescription>
                  Complete your daily habits to maintain your streak
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.habits.map((habit) => (
                  <div key={habit.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${habit.category === 'Health' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                      <div>
                        <p className="font-medium text-sm">{habit.name}</p>
                        <p className="text-xs text-slate-500">{habit.category} • {habit.streak} day streak</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">{habit.current}/{habit.target}</span>
                      <Button
                        size="sm"
                        variant={habit.completed ? "outline" : "default"}
                        onClick={() => handleHabitComplete(habit.id)}
                        disabled={habit.completed}
                      >
                        {habit.completed ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Today's Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ClipboardList className="w-5 h-5 mr-2" />
                  Today's Tasks
                </CardTitle>
                <CardDescription>
                  Manage your tasks and stay organized
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        task.priority === 'high' ? 'bg-red-500' : 
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-sm">{task.title}</p>
                        <p className="text-xs text-slate-500">{task.category} • Due {new Date(task.dueDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                        {task.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant={task.status === 'completed' ? "outline" : "default"}
                        onClick={() => handleTaskComplete(task.id)}
                        disabled={task.status === 'completed'}
                      >
                        {task.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Plan Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="w-5 h-5 mr-2" />
              Your {userPlan} Plan Features
            </CardTitle>
            <CardDescription>
              Features available with your current plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getPlanFeatures().map((feature, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <feature.icon className={`w-5 h-5 ${feature.available ? 'text-green-600' : 'text-slate-400'}`} />
                  <span className={`text-sm ${feature.available ? 'text-slate-900' : 'text-slate-500'}`}>
                    {feature.name}
                  </span>
                  {!feature.available && (
                    <Lock className="w-4 h-4 text-slate-400 ml-auto" />
                  )}
                </div>
              ))}
            </div>
            
            {userPlan !== 'Premium' && (
              <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-indigo-900">Upgrade for More Features</h3>
                    <p className="text-sm text-indigo-700">Unlock advanced features and take your productivity to the next level</p>
                  </div>
                  <Button onClick={() => handleUpgrade(userPlan === 'Free' ? 'Basic' : userPlan === 'Basic' ? 'Pro' : 'Premium')}>
                    Upgrade Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Access your most used features quickly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm">Habit Tracker</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <ClipboardList className="w-6 h-6" />
                <span className="text-sm">Task Manager</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users className="w-6 h-6" />
                <span className="text-sm">Challenges</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <SettingsIcon className="w-6 h-6" />
                <span className="text-sm">Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentOpen}
        plan={selectedPlan}
        onPay={handlePay}
        onChangePlan={handleChangePlan}
        isLoading={isLoading}
      />
    </div>
  );
}; 