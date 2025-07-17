import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { HabitTracker } from '@/components/features/HabitTracker';
import { TaskManager } from '@/components/features/TaskManager';
import { CommunityChallenges } from '@/components/features/CommunityChallenges';
import { CrossPlatformSync } from '@/components/features/CrossPlatformSync';
import { MobileAppAccess } from '@/components/features/MobileAppAccess';
import { BasicNotifications } from '@/components/features/BasicNotifications';
import { MoodTracker } from '@/components/features/MoodTracker';
import { AICoach } from '@/components/features/AICoach';
import { TestFeature } from '@/components/features/TestFeature';
import { PaymentModal } from '@/components/PaymentModal';
import { AdvancedGoalSetting } from '@/components/features/AdvancedGoalSetting';
import { HabitJournal } from '@/components/features/HabitJournal';
import { ProgressPhotos } from '@/components/features/ProgressPhotos';
import { CustomChallenges } from '@/components/features/CustomChallenges';
import { StreakProtection } from '@/components/features/StreakProtection';
import { SmartReminders } from '@/components/features/SmartReminders';
import { PrioritySupport } from '@/components/features/PrioritySupport';
import { AdvancedAnalytics } from '@/components/features/AdvancedAnalytics';
import { CalendarIntegration } from '@/components/features/CalendarIntegration';
import { VIPSupport } from '@/components/features/VIPSupport';
import { ExclusiveFeatures } from '@/components/features/ExclusiveFeatures';
import { PersonalizedCourses } from '@/components/features/PersonalizedCourses';
import { APIAccess } from '@/components/features/APIAccess';
import { WhiteLabel } from '@/components/features/WhiteLabel';
import { useAuth, UserPlan } from '@/hooks/useAuth';
import { FeatureCard } from '@/components/FeatureCard';
import { FeatureLoader } from '@/components/ui/Loader';
import { BarChart3, ClipboardList, Users, Cloud, Smartphone, Bell, Heart, Sparkles, Star, Camera, Trophy, BookOpen, Flame, MessageSquare, PieChart, Calendar, Shield, Lightbulb, GraduationCap, Globe, Settings, Lock, Search, Plus, Home, Menu, X, ChevronLeft, ChevronRight, RefreshCw, Settings as SettingsIcon, User, LogOut, HelpCircle, Keyboard, MousePointer, Monitor, Smartphone as MobileIcon, Download, Upload, Trash2, Key, Crown, Zap } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { MobileLayout } from '@/components/MobileLayout';
import { MobileHabitTracker } from '@/components/mobile/MobileHabitTracker';
import { MobileTaskManager } from '@/components/mobile/MobileTaskManager';

const allFeatures = [
  // Free
  { title: 'Free Habit Preview', description: 'Preview basic habit tracking with limited features. Upgrade to unlock full functionality.', icon: <BarChart3 className="h-8 w-8" />, featureKey: 'free_habit_preview', requiredPlan: 'Free' },
  { title: 'Pi Network Integration', description: 'Access Pi Network features and earn Pi cryptocurrency through the ecosystem.', icon: <Users className="h-8 w-8" />, featureKey: 'pi_network_integration', requiredPlan: 'Free' },
  // Basic
  { title: 'Basic Habit Tracking', description: 'Track up to 5 daily habits with simple streak counters and basic progress visualization.', icon: <BarChart3 className="h-8 w-8" />, featureKey: 'habit_tracking', requiredPlan: 'Basic' },
  { title: 'Simple Task Management', description: 'Create and manage up to 20 tasks with due dates and basic priority levels.', icon: <ClipboardList className="h-8 w-8" />, featureKey: 'task_management', requiredPlan: 'Basic' },
  { title: 'Community Challenges', description: 'Join public community challenges and view basic leaderboards.', icon: <Users className="h-8 w-8" />, featureKey: 'community_challenges', requiredPlan: 'Basic' },
  { title: 'Cross-Platform Sync', description: 'Sync your data across all your devices with automatic cloud backup.', icon: <Cloud className="h-8 w-8" />, featureKey: 'cross_platform_sync', requiredPlan: 'Basic' },
  { title: 'Mobile App Access', description: 'Access Salenus A.I on iOS and Android with basic offline functionality.', icon: <Smartphone className="h-8 w-8" />, featureKey: 'mobile_app', requiredPlan: 'Basic' },
  { title: 'Basic Notifications', description: 'Simple push notifications for habit reminders and task deadlines.', icon: <Bell className="h-8 w-8" />, featureKey: 'basic_notifications', requiredPlan: 'Basic' },
  // Pro
  { title: 'Mood-Based Suggestions', description: 'Get personalized task and habit recommendations based on your daily mood tracking.', icon: <Heart className="h-8 w-8" />, featureKey: 'mood_tracking', requiredPlan: 'Pro' },
  { title: 'Smart Reminders', description: 'AI-powered reminders that adapt to your schedule and optimal productivity times.', icon: <Bell className="h-8 w-8" />, featureKey: 'smart_reminders', requiredPlan: 'Pro' },
  { title: 'Advanced Goal Setting', description: 'Set complex goals with sub-milestones and automated progress tracking.', icon: <Star className="h-8 w-8" />, featureKey: 'advanced_goals', requiredPlan: 'Pro' },
  { title: 'Progress Photos', description: 'Document your journey with progress photos and visual habit tracking.', icon: <Camera className="h-8 w-8" />, featureKey: 'progress_photos', requiredPlan: 'Pro' },
  { title: 'Custom Challenges', description: 'Create private challenges for friends and track group progress.', icon: <Trophy className="h-8 w-8" />, featureKey: 'custom_challenges', requiredPlan: 'Pro' },
  { title: 'Habit Journal', description: 'Advanced journaling with templates, tags, and reflection prompts.', icon: <BookOpen className="h-8 w-8" />, featureKey: 'habit_journal', requiredPlan: 'Pro' },
  { title: 'Streak Protection', description: 'Protect your streaks with freeze days and recovery modes.', icon: <Flame className="h-8 w-8" />, featureKey: 'streak_protection', requiredPlan: 'Pro' },
  { title: 'Priority Support', description: 'Email support with 24-hour response time and live chat access.', icon: <MessageSquare className="h-8 w-8" />, featureKey: 'priority_support', requiredPlan: 'Pro' },
  // Premium
  { title: 'AI Personal Coach', description: 'Get personalized coaching sessions and detailed performance analysis from our AI.', icon: <Sparkles className="h-8 w-8" />, featureKey: 'ai_coaching', requiredPlan: 'Premium' },
  { title: 'Advanced Analytics', description: 'Deep insights with trend analysis, correlation tracking, and predictive suggestions.', icon: <PieChart className="h-8 w-8" />, featureKey: 'advanced_analytics', requiredPlan: 'Premium' },
  { title: 'Calendar Integration', description: 'Full integration with Google Calendar, Outlook, and Apple Calendar for seamless scheduling.', icon: <Calendar className="h-8 w-8" />, featureKey: 'calendar_integration', requiredPlan: 'Premium' },
  { title: 'VIP Support', description: '24/7 priority customer support with dedicated account manager and phone support.', icon: <Shield className="h-8 w-8" />, featureKey: 'vip_support', requiredPlan: 'Premium' },
  { title: 'Exclusive Features', description: 'Early access to beta features, exclusive workshops, and premium content library.', icon: <Lightbulb className="h-8 w-8" />, featureKey: 'exclusive_features', requiredPlan: 'Premium' },
  { title: 'Personalized Courses', description: 'AI-curated learning paths and skill development courses based on your goals.', icon: <GraduationCap className="h-8 w-8" />, featureKey: 'personalized_courses', requiredPlan: 'Premium' },
  { title: 'API Access', description: 'Developer API access to integrate Salenus A.I with your favorite tools and workflows.', icon: <Globe className="h-8 w-8" />, featureKey: 'api_access', requiredPlan: 'Premium' },
  { title: 'White-Label Options', description: 'Custom branding and white-label solutions for teams and organizations.', icon: <Settings className="h-8 w-8" />, featureKey: 'white_label', requiredPlan: 'Premium' },
];

interface UserDashboardProps {
  user?: any;
  onLogout?: () => void;
  onUpgrade?: (plan: UserPlan) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout, onUpgrade }) => {
  const { upgradePlan, isLoading, hasFeature } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();

  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<UserPlan | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [featureLoading, setFeatureLoading] = React.useState(false);
  const [currentFeature, setCurrentFeature] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = React.useState(false);

  // Add state to track which feature is active in overview
  const [activeFeature, setActiveFeature] = React.useState(() => {
    // Default to first available feature based on user plan
    if (user?.plan === 'Free') return 'free-preview';
    if (user?.plan === 'Basic') return 'habits';
    if (user?.plan === 'Pro') return 'habits';
    if (user?.plan === 'Premium') return 'habits';
    return 'habits';
  });

  // Add state to track if current feature is locked
  const [isFeatureLocked, setIsFeatureLocked] = React.useState(false);
  const [lockedFeatureInfo, setLockedFeatureInfo] = React.useState<{
    name: string;
    description: string;
    requiredPlan: UserPlan;
    icon: React.ReactNode;
  } | null>(null);

  // Update tab state to default to overview
  const [activeTab, setActiveTab] = React.useState(() => {
    return localStorage.getItem('dashboardTab') || 'overview';
  });

  // Add settings state
  const [showSettings, setShowSettings] = React.useState(false);
  const [profileData, setProfileData] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profilePublic: false,
      shareProgress: true,
      allowAnalytics: true
    }
  });

  // Add cancellation state
  const [showCancellationModal, setShowCancellationModal] = React.useState(false);
  const [cancellationReason, setCancellationReason] = React.useState('');

  React.useEffect(() => {
    localStorage.setItem('dashboardTab', activeTab);
  }, [activeTab]);

  // Debug logging
  console.log('UserDashboard - User data:', user);
  console.log('UserDashboard - User plan:', user?.plan);
  console.log('UserDashboard - Has paid:', user?.hasPaid);

  // Check if subscription is expired (only for paid plans)
  const isExpired = user && user.plan !== 'Free' && user.planExpiry && new Date(user.planExpiry) < new Date();

  // Check if subscription is expiring soon (within 7 days, only for paid plans)
  const isExpiringSoon = user && user.plan !== 'Free' && user.planExpiry && !isExpired && 
    new Date(user.planExpiry).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;

  // Define payment handlers early to avoid hoisting issues
  const handlePay = async () => {
    if (!selectedPlan) return;
    await upgradePlan(selectedPlan as UserPlan);
    setPaymentOpen(false);
  };

  const handleChangePlan = () => {
    setPaymentOpen(false);
  };

  // Add cancellation handler
  const handleCancelPlan = () => {
    // Update user plan to Free
    const updatedUser = {
      ...user,
      plan: 'Free',
      planExpiry: null,
      hasPaid: false
    };
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Close modal
    setShowCancellationModal(false);
    setCancellationReason('');
    
    // Show success message
    alert('Your plan has been cancelled. You now have access to Free features only. No refunds will be issued.');
  };

  // Mobile-specific handlers
  const handlePullToRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Refresh data here
    }, 1000);
  };

  const handleSwipeAction = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      // Swipe left - open drawer
      setDrawerOpen(true);
    } else {
      // Swipe right - close drawer
      setDrawerOpen(false);
    }
  };

  // Keyboard shortcuts
  const handleKeyboardShortcuts = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'k':
          event.preventDefault();
          setShowSearch(!showSearch);
          break;
        case 'b':
          event.preventDefault();
          setDrawerOpen(!drawerOpen);
          break;
        case 'h':
          event.preventDefault();
          navigate('/dashboard');
          break;
        case 's':
          event.preventDefault();
          setShowSettings(!showSettings);
          break;
        case '1':
          event.preventDefault();
          setActiveTab('overview');
          break;
        case '2':
          event.preventDefault();
          setActiveTab('features');
          break;
        case '3':
          event.preventDefault();
          setShowSettings(true);
          break;
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [drawerOpen, showSearch, showSettings]);

  const handleSignOut = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Check if user has access to a specific plan level using hasFeature
  const hasPlanAccess = (requiredPlan: string) => {
    // Map plan names to feature keys
    const planFeatureMap = {
      'Free': 'habit_tracking', // Free users have access to basic habit tracking
      'Basic': 'community_challenges', // Basic users have access to community challenges
      'Pro': 'mood_tracking', // Pro users have access to mood tracking
      'Premium': 'ai_coaching' // Premium users have access to AI coaching
    };
    
    const featureKey = planFeatureMap[requiredPlan as keyof typeof planFeatureMap];
    if (!featureKey) return false;
    
    return hasFeature(featureKey);
  };

  // For upgrades, call onUpgrade from parent (Index.tsx)
  const handleLockedFeatureClick = (feature: string, minPlan: UserPlan) => {
    if (onUpgrade) {
      onUpgrade(minPlan);
      setDrawerOpen(false);
    } else {
      setSelectedPlan(minPlan);
      setPaymentOpen(true);
      setDrawerOpen(false);
    }
  };

  // Filter features based on user's plan
  const availableFeatures = allFeatures.filter(feature => hasPlanAccess(feature.requiredPlan));

  // Function to handle feature navigation from sidebar
  const handleFeatureNavigation = (featureName: string, route: string) => {
    setFeatureLoading(true);
    setCurrentFeature(featureName);
    setActiveFeature(route);
    setActiveTab('overview'); // Switch to overview tab when navigating to a feature
    
    // Map routes to feature keys for access checking
    const routeFeatureMap = {
      'free-preview': 'habit_tracking',
      'pi-network': 'habit_tracking',
      'habits': 'habit_tracking',
      'tasks': 'task_management',
      'challenges': 'community_challenges',
      'sync': 'cross_platform_sync',
      'mobile': 'mobile_app',
      'notifications': 'basic_notifications',
      'mood': 'mood_tracking',
      'goals': 'advanced_goals',
      'journal': 'habit_journal',
      'photos': 'progress_photos',
      'custom-challenges': 'custom_challenges',
      'streak-protection': 'streak_protection',
      'smart-reminders': 'smart_reminders',
      'support': 'priority_support',
      'ai-coach': 'ai_coaching',
      'analytics': 'advanced_analytics',
      'calendar': 'calendar_integration',
      'vip-support': 'vip_support',
      'exclusive': 'exclusive_features',
      'courses': 'personalized_courses',
      'api': 'api_access',
      'white-label': 'white_label'
    };

    const featureKey = routeFeatureMap[route as keyof typeof routeFeatureMap];
    
    if (featureKey && !hasFeature(featureKey)) {
      // Feature is locked - show locked feature view
      setIsFeatureLocked(true);
      
      // Determine required plan based on feature
      const featurePlanMap = {
        'habit_tracking': 'Free',
        'task_management': 'Free',
        'basic_notifications': 'Free',
        'community_challenges': 'Basic',
        'cross_platform_sync': 'Basic',
        'mobile_app': 'Basic',
        'mood_tracking': 'Pro',
        'smart_reminders': 'Pro',
        'advanced_goals': 'Pro',
        'progress_photos': 'Pro',
        'custom_challenges': 'Pro',
        'habit_journal': 'Pro',
        'streak_protection': 'Pro',
        'priority_support': 'Pro',
        'ai_coaching': 'Premium',
        'advanced_analytics': 'Premium',
        'calendar_integration': 'Premium',
        'personalized_courses': 'Premium',
        'api_access': 'Premium',
        'white_label': 'Premium',
        'vip_support': 'Premium',
        'exclusive_features': 'Premium'
      };
      
      const requiredPlan = featurePlanMap[featureKey as keyof typeof featurePlanMap] as UserPlan;
      
      setLockedFeatureInfo({
        name: featureName,
        description: getFeatureDescription(featureName),
        requiredPlan,
        icon: getFeatureIcon(featureName)
      });
    } else {
      // Feature is available
      setIsFeatureLocked(false);
      setLockedFeatureInfo(null);
    }
    
    // Simulate loading time
    setTimeout(() => {
      setFeatureLoading(false);
      setCurrentFeature('');
    }, 1500);
  };

  // Helper function to get feature description
  const getFeatureDescription = (featureName: string) => {
    const descriptions: Record<string, string> = {
      'Habit Tracking': 'Track your daily habits and build streaks with advanced analytics',
      'Task Management': 'Create and manage tasks with due dates and priority levels',
      'Community Challenges': 'Join community challenges and compete with others',
      'Cross-Platform Sync': 'Sync your data across all your devices',
      'Mobile App Access': 'Access Salenus A.I on mobile devices',
      'Basic Notifications': 'Get smart reminders and notifications',
      'Mood Tracker': 'Track your mood and get personalized insights',
      'Advanced Goals': 'Set complex goals with sub-milestones and tracking',
      'Habit Journal': 'Advanced journaling with templates and reflection prompts',
      'Progress Photos': 'Document your journey with progress photos',
      'Custom Challenges': 'Create private challenges for friends and family',
      'Streak Protection': 'Protect your streaks with freeze days and recovery modes',
      'Smart Reminders': 'AI-powered reminders that adapt to your schedule',
      'Priority Support': 'Get priority customer support with faster response times',
      'AI Personal Coach': 'Get personalized coaching sessions from our AI',
      'Advanced Analytics': 'Deep insights with trend analysis and predictions',
      'Calendar Integration': 'Full integration with Google Calendar, Outlook, and Apple Calendar',
      'VIP Support': '24/7 priority support with dedicated account manager',
      'Exclusive Features': 'Early access to beta features and exclusive content',
      'Personalized Courses': 'AI-curated learning paths based on your goals',
      'API Access': 'Developer API access to integrate with your tools',
      'White-Label Options': 'Custom branding and white-label solutions'
    };
    return descriptions[featureName] || 'Advanced feature with powerful capabilities';
  };

  // Helper function to get feature icon
  const getFeatureIcon = (featureName: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Habit Tracking': <BarChart3 className="h-8 w-8" />,
      'Task Management': <ClipboardList className="h-8 w-8" />,
      'Community Challenges': <Users className="h-8 w-8" />,
      'Cross-Platform Sync': <Cloud className="h-8 w-8" />,
      'Mobile App Access': <Smartphone className="h-8 w-8" />,
      'Basic Notifications': <Bell className="h-8 w-8" />,
      'Mood Tracker': <Heart className="h-8 w-8" />,
      'Advanced Goals': <Star className="h-8 w-8" />,
      'Habit Journal': <BookOpen className="h-8 w-8" />,
      'Progress Photos': <Camera className="h-8 w-8" />,
      'Custom Challenges': <Trophy className="h-8 w-8" />,
      'Streak Protection': <Flame className="h-8 w-8" />,
      'Smart Reminders': <Bell className="h-8 w-8" />,
      'Priority Support': <MessageSquare className="h-8 w-8" />,
      'AI Personal Coach': <Sparkles className="h-8 w-8" />,
      'Advanced Analytics': <PieChart className="h-8 w-8" />,
      'Calendar Integration': <Calendar className="h-8 w-8" />,
      'VIP Support': <Shield className="h-8 w-8" />,
      'Exclusive Features': <Lightbulb className="h-8 w-8" />,
      'Personalized Courses': <GraduationCap className="h-8 w-8" />,
      'API Access': <Globe className="h-8 w-8" />,
      'White-Label Options': <Settings className="h-8 w-8" />
    };
    return icons[featureName] || <Zap className="h-8 w-8" />;
  };

  // Get current breadcrumb path
  const getBreadcrumbPath = () => {
    const path = location.pathname.split('/').pop() || 'dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  // LockedFeature Component
  const LockedFeature = ({ featureInfo }: { featureInfo: { name: string; description: string; requiredPlan: UserPlan; icon: React.ReactNode } }) => {
    const planPrices = {
      'Basic': '5 Pi',
      'Pro': '10 Pi',
      'Premium': '15 Pi'
    };

    const planColors = {
      'Basic': 'bg-blue-600',
      'Pro': 'bg-purple-600',
      'Premium': 'bg-yellow-600'
    };

    return (
      <div className="space-y-6">
        {/* Locked Feature Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                {featureInfo.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{featureInfo.name}</h3>
                <p className="text-gray-600">{featureInfo.description}</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-red-600 border-red-200">
              <Lock className="h-4 w-4 mr-1" />
              Locked
            </Badge>
          </div>
        </div>

        {/* Locked Feature Content */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="relative">
            {/* Blurred overlay */}
            <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <Lock className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Upgrade to {featureInfo.requiredPlan}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Unlock {featureInfo.name} and many more features
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    <Badge className={`${planColors[featureInfo.requiredPlan]} text-white`}>
                      {planPrices[featureInfo.requiredPlan]}
                    </Badge>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">Unlock all {featureInfo.requiredPlan} features</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Blurred content underneath */}
            <div className="p-6 opacity-30">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Crown className="h-6 w-6 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Unlock {featureInfo.requiredPlan} Features
              </h3>
            </div>
            <p className="text-gray-600 max-w-md mx-auto">
              Get access to {featureInfo.name} and all other {featureInfo.requiredPlan} features for just {planPrices[featureInfo.requiredPlan]}
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Button 
                onClick={() => handleLockedFeatureClick('upgrade', featureInfo.requiredPlan)}
                className={`${planColors[featureInfo.requiredPlan]} hover:opacity-90 text-white font-semibold`}
              >
                <Zap className="h-4 w-4 mr-2" />
                Upgrade to {featureInfo.requiredPlan}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setActiveTab('features')}
              >
                View All Features
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Enhanced Sidebar for desktop, Drawer for mobile */}
      {isMobile ? (
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side="left" className="p-0 w-80 max-w-full">
            <Sidebar onLockedFeatureClick={handleFeatureNavigation} userPlan={user.plan} />
          </SheetContent>
        </Sheet>
      ) : (
        <Sidebar onLockedFeatureClick={handleFeatureNavigation} userPlan={user.plan} />
      )}
      
      <main className="flex-1 overflow-y-auto">
        {/* Enhanced Header with Mobile/Desktop optimizations */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-4 border-b border-slate-200 bg-white shadow-sm md:px-8 md:py-6">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                className="mr-3 p-2 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6 text-slate-700" />
              </button>
            )}
            
            {/* Breadcrumb Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard" className="flex items-center">
                      <Home className="h-4 w-4 mr-1" />
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{getBreadcrumbPath()}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <span className="text-xl md:text-2xl font-bold text-navy-900">Salenus A.I Dashboard</span>
            <Badge variant="secondary" className="ml-3">
              {user.plan} Plan
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Bar */}
            {!isMobile && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search features..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>{user.name || user.email}</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Keyboard Shortcuts Help */}
            {!isMobile && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowKeyboardShortcuts(true)}
                      className="hidden lg:flex"
                    >
                      <Keyboard className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Keyboard shortcuts</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        
        {/* Enhanced Expiring Soon Banner */}
        {isExpiringSoon && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200 px-4 md:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-yellow-800">
                  Your {user.plan} plan expires in {
                    Math.ceil((new Date(user.planExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  } days
                </span>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => handleLockedFeatureClick('renew', user.plan as UserPlan)}
                className="text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              >
                Renew Now →
              </Button>
            </div>
          </div>
        )}
        
        {/* Enhanced Plan Status Banner */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-800">
                {user.plan} Plan Active - {availableFeatures.length} features unlocked
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Enhanced Plan Expiration Panel */}
              {user.plan !== 'Free' && user.planExpiry && (
                <div className="bg-white rounded-lg px-4 py-2 border border-indigo-200 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    <div className="text-xs">
                      <div className="font-medium text-indigo-800">
                        {user.planExpiry ? (
                          <>
                            Expires: {new Date(user.planExpiry).toLocaleDateString()}
                            <Badge variant="outline" className="ml-2">
                              {(() => {
                                const expiryDate = new Date(user.planExpiry);
                                const now = new Date();
                                const diffTime = expiryDate.getTime() - now.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                
                                if (diffDays <= 0) {
                                  return 'Expired';
                                } else if (diffDays <= 7) {
                                  return `${diffDays} days left`;
                                } else if (diffDays <= 30) {
                                  return `${Math.ceil(diffDays / 7)} weeks left`;
                                } else {
                                  return `${Math.ceil(diffDays / 30)} months left`;
                                }
                              })()}
                            </Badge>
                          </>
                        ) : (
                          'No expiry date'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Auto-Renewal Status */}
              {user.plan !== 'Free' && user.planExpiry && new Date(user.planExpiry) > new Date() && (
                <div className="bg-green-50 rounded-lg px-3 py-2 border border-green-200 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-xs">
                      <div className="font-medium text-green-800">Auto-renewal enabled</div>
                      <div className="text-green-600">
                        Next renewal: {new Date(user.planExpiry).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {user.plan !== 'Premium' && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => handleLockedFeatureClick('upgrade', 
                    (user.plan === 'Free' ? 'Basic' : 
                    user.plan === 'Basic' ? 'Pro' : 'Premium') as UserPlan
                  )}
                  className="text-indigo-600 border-indigo-300 hover:bg-indigo-100"
                >
                  Upgrade to {user.plan === 'Free' ? 'Basic' : user.plan === 'Basic' ? 'Pro' : 'Premium'} →
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Main Content Area */}
        <div className="p-4 md:p-8">
          {/* Tab Bar */}
          <div className="flex gap-2 mb-6 border-b border-slate-200">
            <button
              className={`px-4 py-2 font-semibold rounded-t-md transition-all duration-200 focus:outline-none ${activeTab === 'overview' ? 'bg-white border-x border-t border-slate-200 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 font-semibold rounded-t-md transition-all duration-200 focus:outline-none ${activeTab === 'features' ? 'bg-white border-x border-t border-slate-200 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
              onClick={() => setActiveTab('features')}
            >
              Features
            </button>
            <button
              className={`px-4 py-2 font-semibold rounded-t-md transition-all duration-200 focus:outline-none ${activeTab === 'settings' ? 'bg-white border-x border-t border-slate-200 text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' ? (
            // Overview Tab Content - Show actual feature component or locked feature view
            <div className="space-y-6">
              {featureLoading ? (
                <FeatureLoader featureName={currentFeature} />
              ) : isFeatureLocked && lockedFeatureInfo ? (
                // Show locked feature view
                <LockedFeature featureInfo={lockedFeatureInfo} />
              ) : (
                // Show available feature component
                <>
                  {/* Feature Header */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {activeFeature === 'habits' && 'Habit Tracking'}
                          {activeFeature === 'tasks' && 'Task Management'}
                          {activeFeature === 'challenges' && 'Community Challenges'}
                          {activeFeature === 'sync' && 'Cross-Platform Sync'}
                          {activeFeature === 'mobile' && 'Mobile App Access'}
                          {activeFeature === 'notifications' && 'Basic Notifications'}
                          {activeFeature === 'mood' && 'Mood Tracker'}
                          {activeFeature === 'free-preview' && 'Free Habit Preview'}
                          {activeFeature === 'pi-network' && 'Pi Network Integration'}
                          {activeFeature === 'goals' && 'Advanced Goals'}
                          {activeFeature === 'journal' && 'Habit Journal'}
                          {activeFeature === 'photos' && 'Progress Photos'}
                          {activeFeature === 'custom-challenges' && 'Custom Challenges'}
                          {activeFeature === 'streak-protection' && 'Streak Protection'}
                          {activeFeature === 'smart-reminders' && 'Smart Reminders'}
                          {activeFeature === 'support' && 'Priority Support'}
                          {activeFeature === 'ai-coach' && 'AI Personal Coach'}
                          {activeFeature === 'analytics' && 'Advanced Analytics'}
                          {activeFeature === 'calendar' && 'Calendar Integration'}
                          {activeFeature === 'vip-support' && 'VIP Support'}
                          {activeFeature === 'exclusive' && 'Exclusive Features'}
                          {activeFeature === 'courses' && 'Personalized Courses'}
                          {activeFeature === 'api' && 'API Access'}
                          {activeFeature === 'white-label' && 'White-Label Options'}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {activeFeature === 'habits' && 'Track your daily habits and build streaks'}
                          {activeFeature === 'tasks' && 'Manage your tasks and stay organized'}
                          {activeFeature === 'challenges' && 'Join community challenges and compete'}
                          {activeFeature === 'sync' && 'Sync your data across all devices'}
                          {activeFeature === 'mobile' && 'Access Salenus A.I on mobile devices'}
                          {activeFeature === 'notifications' && 'Get smart reminders and notifications'}
                          {activeFeature === 'mood' && 'Track your mood and get insights'}
                          {activeFeature === 'free-preview' && 'Preview basic habit tracking features'}
                          {activeFeature === 'pi-network' && 'Integrate with Pi Network ecosystem'}
                          {activeFeature === 'goals' && 'Set and track advanced goals'}
                          {activeFeature === 'journal' && 'Journal your habits and progress'}
                          {activeFeature === 'photos' && 'Track progress with photos'}
                          {activeFeature === 'custom-challenges' && 'Create custom challenges'}
                          {activeFeature === 'streak-protection' && 'Protect your streaks'}
                          {activeFeature === 'smart-reminders' && 'Get AI-powered reminders'}
                          {activeFeature === 'support' && 'Get priority customer support'}
                          {activeFeature === 'ai-coach' && 'Get personalized AI coaching'}
                          {activeFeature === 'analytics' && 'Advanced analytics and insights'}
                          {activeFeature === 'calendar' && 'Full calendar integration'}
                          {activeFeature === 'vip-support' && '24/7 VIP support'}
                          {activeFeature === 'exclusive' && 'Access exclusive features'}
                          {activeFeature === 'courses' && 'Personalized learning courses'}
                          {activeFeature === 'api' && 'Developer API access'}
                          {activeFeature === 'white-label' && 'White-label solutions'}
                        </p>
                      </div>
                      <Badge variant="secondary">{user.plan} Plan</Badge>
                    </div>
                  </div>

                  {/* Feature Component */}
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6">
                      {/* Render the actual feature component based on activeFeature */}
                      {activeFeature === 'habits' && hasPlanAccess('Basic') && <HabitTracker />}
                      {activeFeature === 'tasks' && hasPlanAccess('Basic') && <TaskManager />}
                      {activeFeature === 'challenges' && hasPlanAccess('Basic') && <CommunityChallenges />}
                      {activeFeature === 'sync' && hasPlanAccess('Basic') && <CrossPlatformSync />}
                      {activeFeature === 'mobile' && hasPlanAccess('Basic') && <MobileAppAccess />}
                      {activeFeature === 'notifications' && hasPlanAccess('Basic') && <BasicNotifications />}
                      {activeFeature === 'mood' && hasPlanAccess('Pro') && <MoodTracker />}
                      {activeFeature === 'free-preview' && hasPlanAccess('Free') && (
                        <TestFeature 
                          featureName="Free Habit Preview" 
                          description="Preview basic habit tracking. Upgrade to unlock full functionality." 
                          icon={<BarChart3 className="h-8 w-8" />} 
                          color="bg-gray-100" 
                        />
                      )}
                      {activeFeature === 'pi-network' && hasPlanAccess('Free') && (
                        <TestFeature 
                          featureName="Pi Network Integration" 
                          description="Access Pi Network features and earn Pi cryptocurrency." 
                          icon={<Users className="h-8 w-8" />} 
                          color="bg-yellow-100" 
                        />
                      )}
                      {activeFeature === 'goals' && hasPlanAccess('Pro') && <AdvancedGoalSetting onUpgrade={() => setPaymentOpen(true)} />}
                      {activeFeature === 'journal' && hasPlanAccess('Pro') && <HabitJournal onUpgrade={() => setPaymentOpen(true)} />}
                      {activeFeature === 'photos' && hasPlanAccess('Pro') && <ProgressPhotos onUpgrade={() => setPaymentOpen(true)} />}
                      {activeFeature === 'custom-challenges' && hasPlanAccess('Pro') && <CustomChallenges onUpgrade={() => setPaymentOpen(true)} />}
                      {activeFeature === 'streak-protection' && hasPlanAccess('Pro') && <StreakProtection onUpgrade={() => setPaymentOpen(true)} />}
                      {activeFeature === 'smart-reminders' && hasPlanAccess('Pro') && <SmartReminders onUpgrade={() => setPaymentOpen(true)} />}
                      {activeFeature === 'support' && hasPlanAccess('Pro') && <PrioritySupport onUpgrade={() => setPaymentOpen(true)} />}
                      {activeFeature === 'ai-coach' && hasPlanAccess('Premium') && <AICoach />}
                      {activeFeature === 'analytics' && hasPlanAccess('Premium') && <AdvancedAnalytics onUpgrade={() => setPaymentOpen(true)} />}
                      {activeFeature === 'calendar' && hasPlanAccess('Premium') && <CalendarIntegration onUpgrade={() => setPaymentOpen(true)} />}
                      {activeFeature === 'vip-support' && hasPlanAccess('Premium') && <VIPSupport onUpgrade={() => setPaymentOpen(true)} />}
                      {activeFeature === 'exclusive' && hasPlanAccess('Premium') && <ExclusiveFeatures onUpgrade={() => setPaymentOpen(true)} />}
                      {activeFeature === 'courses' && hasPlanAccess('Premium') && <PersonalizedCourses onUpgrade={() => setPaymentOpen(true)} />}
                      {activeFeature === 'api' && hasPlanAccess('Premium') && <APIAccess onUpgrade={() => setPaymentOpen(true)} />}
                      {activeFeature === 'white-label' && hasPlanAccess('Premium') && <WhiteLabel onUpgrade={() => setPaymentOpen(true)} />}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : activeTab === 'features' ? (
            // Features Tab Content (existing feature grid)
            <div>
              {/* Show loading state when navigating */}
              {featureLoading ? (
                <FeatureLoader featureName={currentFeature} />
              ) : (
                <>
                  {/* Enhanced Feature Overview Section */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Available Features</h2>
                        <p className="text-gray-600">
                          Based on your {user.plan} plan, you have access to {availableFeatures.length} features.
                        </p>
                      </div>
                      
                      {/* Desktop: Quick Actions */}
                      {!isMobile && (
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                          </Button>
                          <Button variant="outline" size="sm">
                            <SettingsIcon className="h-4 w-4 mr-2" />
                            Settings
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Enhanced Plan Information Panel */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Plan Details</h3>
                      <Badge variant={
                        user.plan === 'Free' ? 'secondary' :
                        user.plan === 'Basic' ? 'default' :
                        user.plan === 'Pro' ? 'outline' : 'default'
                      }>
                        {user.plan} Plan
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Plan Status */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">Plan Status</h4>
                        <div className="text-sm text-gray-600">
                          {user.plan === 'Free' ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Active (Free)</span>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  user.planExpiry && new Date(user.planExpiry) > new Date() 
                                    ? 'bg-green-500' 
                                    : 'bg-red-500'
                                }`}></div>
                                <span>{user.planExpiry && new Date(user.planExpiry) > new Date() ? 'Active' : 'Expired'}</span>
                              </div>
                              {user.planExpiry && (
                                <div className="text-xs text-gray-500">
                                  Since: {new Date(user.planExpiry).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Billing Information */}
                      {user.plan !== 'Free' && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-700">Billing Information</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            {user.planExpiry ? (
                              <>
                                <div>
                                  <span className="font-medium">Cycle:</span> {
                                    (() => {
                                      const expiryDate = new Date(user.planExpiry);
                                      const now = new Date();
                                      const diffTime = expiryDate.getTime() - now.getTime();
                                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                      
                                      if (diffDays > 365) {
                                        return 'Yearly';
                                      } else if (diffDays > 30) {
                                        return 'Monthly';
                                      } else {
                                        return 'Trial';
                                      }
                                    })()
                                  }
                                </div>
                                <div>
                                  <span className="font-medium">Next Payment:</span> {new Date(user.planExpiry).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="font-medium">Price:</span> {
                                    (() => {
                                      const expiryDate = new Date(user.planExpiry);
                                      const now = new Date();
                                      const diffTime = expiryDate.getTime() - now.getTime();
                                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                      
                                      if (diffDays > 365) {
                                        return user.plan === 'Basic' ? '50 Pi/year' : 
                                               user.plan === 'Pro' ? '100 Pi/year' : '150 Pi/year';
                                      } else {
                                        return user.plan === 'Basic' ? '5 Pi/month' : 
                                               user.plan === 'Pro' ? '10 Pi/month' : '15 Pi/month';
                                      }
                                    })()
                                  }
                                </div>
                                
                                {/* Enhanced Billing Cycle Progress Bar */}
                                {(() => {
                                  const expiryDate = new Date(user.planExpiry);
                                  const now = new Date();
                                  const totalDays = expiryDate.getTime() - now.getTime() > 365 * 24 * 60 * 60 * 1000 ? 365 : 30;
                                  const remainingDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                  const progressPercentage = Math.max(0, Math.min(100, ((totalDays - remainingDays) / totalDays) * 100));
                                  
                                  return (
                                    <div className="mt-3">
                                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                                        <span>Billing Progress</span>
                                        <span>{Math.round(progressPercentage)}% used</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className={`h-2 rounded-full transition-all duration-300 ${
                                            progressPercentage > 80 ? 'bg-red-500' :
                                            progressPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                          }`}
                                          style={{ width: `${progressPercentage}%` }}
                                        ></div>
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {remainingDays > 0 ? `${remainingDays} days remaining` : 'Expired'}
                                      </div>
                                    </div>
                                  );
                                })()}
                              </>
                            ) : (
                              <div>No billing information</div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Plan Benefits */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">Plan Benefits</h4>
                        <div className="text-sm text-gray-600">
                          <div className="space-y-1">
                            <div>• {availableFeatures.length} features unlocked</div>
                            <div>• {user.plan === 'Free' ? 'Limited access' : 
                                   user.plan === 'Basic' ? 'Basic support' :
                                   user.plan === 'Pro' ? 'Priority support' : 'VIP support'}</div>
                            <div>• {user.plan === 'Free' ? 'No sync' : 
                                   user.plan === 'Basic' ? 'Basic sync' :
                                   user.plan === 'Pro' ? 'Advanced sync' : 'Full sync'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-600">
                        {user.plan === 'Free' ? (
                          'Upgrade to unlock premium features'
                        ) : user.planExpiry && new Date(user.planExpiry) <= new Date() ? (
                          'Your plan has expired. Renew to continue access.'
                        ) : (
                          'Your plan is active and working perfectly'
                        )}
                      </div>
                      <div className="flex space-x-3">
                        {user.plan !== 'Premium' && (
                          <Button 
                            onClick={() => handleLockedFeatureClick('upgrade', 
                              (user.plan === 'Free' ? 'Basic' : 
                              user.plan === 'Basic' ? 'Pro' : 'Premium') as UserPlan
                            )}
                            variant="default"
                            size="sm"
                          >
                            {user.plan === 'Free' ? 'Upgrade Plan' : 
                             user.planExpiry && new Date(user.planExpiry) <= new Date() ? 'Renew Plan' : 'Upgrade'}
                          </Button>
                        )}
                        {user.plan !== 'Free' && user.planExpiry && new Date(user.planExpiry) > new Date() && (
                          <Button 
                            onClick={() => handleLockedFeatureClick('manage', user.plan as UserPlan)}
                            variant="outline"
                            size="sm"
                          >
                            Manage Plan
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Feature Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
                    {allFeatures.map(feature => {
                      const isAvailable = hasPlanAccess(feature.requiredPlan);
                      const isLocked = !isAvailable;
                      
                      return (
                        <FeatureCard
                          key={feature.featureKey}
                          title={feature.title}
                          description={feature.description}
                          icon={feature.icon}
                          featureKey={feature.featureKey}
                          requiredPlan={feature.requiredPlan as UserPlan}
                          userPlan={user.plan as UserPlan}
                          isLocked={isLocked}
                          onUpgrade={() => handleLockedFeatureClick(feature.featureKey, feature.requiredPlan as UserPlan)}
                        />
                      );
                    })}
                  </div>

                  {/* Enhanced Plan-specific routes */}
                  <Routes>
                    {/* Free Plan Routes */}
                    <Route path="free-preview" element={hasPlanAccess('Free') ? <TestFeature featureName="Free Habit Preview" description="Preview basic habit tracking. Upgrade to unlock full functionality." icon={<BarChart3 className="h-8 w-8" />} color="bg-gray-100" /> : <Navigate to="/dashboard" replace />} />
                    <Route path="pi-network" element={hasPlanAccess('Free') ? <TestFeature featureName="Pi Network Integration" description="Access Pi Network features and earn Pi cryptocurrency." icon={<Users className="h-8 w-8" />} color="bg-yellow-100" /> : <Navigate to="/dashboard" replace />} />
                    
                    {/* Basic Plan Routes */}
                    <Route path="habits" element={hasPlanAccess('Basic') ? <HabitTracker /> : <Navigate to="/dashboard" replace />} />
                    <Route path="tasks" element={hasPlanAccess('Basic') ? <TaskManager /> : <Navigate to="/dashboard" replace />} />
                    <Route path="challenges" element={hasPlanAccess('Basic') ? <CommunityChallenges /> : <Navigate to="/dashboard" replace />} />
                    <Route path="sync" element={hasPlanAccess('Basic') ? <CrossPlatformSync /> : <Navigate to="/dashboard" replace />} />
                    <Route path="mobile" element={hasPlanAccess('Basic') ? <MobileAppAccess /> : <Navigate to="/dashboard" replace />} />
                    <Route path="notifications" element={hasPlanAccess('Basic') ? <BasicNotifications /> : <Navigate to="/dashboard" replace />} />
                    
                    {/* Pro Plan Routes */}
                    <Route path="mood" element={hasPlanAccess('Pro') ? <MoodTracker /> : <Navigate to="/dashboard" replace />} />
                    <Route path="goals" element={hasPlanAccess('Pro') ? <TestFeature featureName="Advanced Goals" description="Pro feature - Advanced goal setting with milestones" icon={<Star className="h-8 w-8" />} color="bg-purple-100" /> : <Navigate to="/dashboard" replace />} />
                    <Route path="journal" element={hasPlanAccess('Pro') ? <TestFeature featureName="Habit Journal" description="Pro feature - Advanced journaling with templates" icon={<BookOpen className="h-8 w-8" />} color="bg-indigo-100" /> : <Navigate to="/dashboard" replace />} />
                    <Route path="photos" element={hasPlanAccess('Pro') ? <TestFeature featureName="Progress Photos" description="Pro feature - Progress photos and visual tracking" icon={<Camera className="h-8 w-8" />} color="bg-pink-100" /> : <Navigate to="/dashboard" replace />} />
                    <Route path="custom-challenges" element={hasPlanAccess('Pro') ? <TestFeature featureName="Custom Challenges" description="Pro feature - Create private challenges for friends" icon={<Trophy className="h-8 w-8" />} color="bg-orange-100" /> : <Navigate to="/dashboard" replace />} />
                    <Route path="streak-protection" element={hasPlanAccess('Pro') ? <TestFeature featureName="Streak Protection" description="Pro feature - Protect your streaks with freeze days" icon={<Flame className="h-8 w-8" />} color="bg-red-100" /> : <Navigate to="/dashboard" replace />} />
                    <Route path="smart-reminders" element={hasPlanAccess('Pro') ? <TestFeature featureName="Smart Reminders" description="Pro feature - AI-powered adaptive reminders" icon={<Bell className="h-8 w-8" />} color="bg-green-100" /> : <Navigate to="/dashboard" replace />} />
                    <Route path="support" element={hasPlanAccess('Pro') ? <TestFeature featureName="Priority Support" description="Pro feature - Email support with 24-hour response" icon={<MessageSquare className="h-8 w-8" />} color="bg-blue-100" /> : <Navigate to="/dashboard" replace />} />
                    
                    {/* Premium Plan Routes */}
                    <Route path="ai-coach" element={hasPlanAccess('Premium') ? <AICoach /> : <Navigate to="/dashboard" replace />} />
                    <Route path="analytics" element={hasPlanAccess('Premium') ? <TestFeature featureName="Advanced Analytics" description="Premium feature - Deep insights and predictive analytics" icon={<PieChart className="h-8 w-8" />} color="bg-indigo-100" /> : <Navigate to="/dashboard" replace />} />
                    <Route path="calendar" element={hasPlanAccess('Premium') ? <TestFeature featureName="Calendar Integration" description="Premium feature - Full calendar integration" icon={<Calendar className="h-8 w-8" />} color="bg-purple-100" /> : <Navigate to="/dashboard" replace />} />
                    <Route path="vip-support" element={hasPlanAccess('Premium') ? <TestFeature featureName="VIP Support" description="Premium feature - 24/7 priority support with dedicated manager" icon={<Shield className="h-8 w-8" />} color="bg-yellow-100" /> : <Navigate to="/dashboard" replace />} />
                    <Route path="exclusive" element={hasPlanAccess('Premium') ? <TestFeature featureName="Exclusive Features" description="Premium feature - Early access to beta features" icon={<Lightbulb className="h-8 w-8" />} color="bg-pink-100" /> : <Navigate to="/dashboard" replace />} />
                    <Route path="courses" element={hasPlanAccess('Premium') ? <TestFeature featureName="Personalized Courses" description="Premium feature - AI-curated learning paths" icon={<GraduationCap className="h-8 w-8" />} color="bg-green-100" /> : <Navigate to="/dashboard" replace />} />
                    <Route path="api" element={hasPlanAccess('Premium') ? <TestFeature featureName="API Access" description="Premium feature - Developer API access" icon={<Globe className="h-8 w-8" />} color="bg-blue-100" /> : <Navigate to="/dashboard" replace />} />
                    <Route path="white-label" element={hasPlanAccess('Premium') ? <TestFeature featureName="White-Label Options" description="Premium feature - Custom branding solutions" icon={<Settings className="h-8 w-8" />} color="bg-gray-100" /> : <Navigate to="/dashboard" replace />} />
                    
                    {/* Default route based on user plan */}
                    <Route path="*" element={
                      user.plan === 'Free' ? <Navigate to="free-preview" replace /> :
                      user.plan === 'Basic' ? <Navigate to="habits" replace /> :
                      user.plan === 'Pro' ? <Navigate to="habits" replace /> :
                      user.plan === 'Premium' ? <Navigate to="habits" replace /> :
                      <Navigate to="habits" replace />
                    } />
                  </Routes>
                </>
              )}
            </div>
          ) : (
            // Settings Tab Content
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
                <div className="space-y-4">
                  {/* Avatar */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={profileData.avatar || "/logo.png"} 
                        alt="Profile" 
                        className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                      />
                      <button className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full p-1 hover:bg-indigo-700 transition-colors">
                        <Camera className="h-3 w-3" />
                      </button>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Profile Picture</h4>
                      <p className="text-sm text-gray-500">Click to upload a new image</p>
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>

              {/* Plan Management */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Management</h3>
                <div className="space-y-4">
                  {/* Current Plan */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Current Plan: {user.plan}</h4>
                        <p className="text-sm text-gray-600">
                          {user.planExpiry ? `Expires: ${new Date(user.planExpiry).toLocaleDateString()}` : 'No expiry date'}
                        </p>
                      </div>
                      <Badge variant={user.plan === 'Premium' ? 'default' : 'outline'}>
                        {user.plan} Plan
                      </Badge>
                    </div>
                  </div>

                  {/* Plan Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.plan !== 'Premium' && (
                      <Button 
                        onClick={() => handleLockedFeatureClick('upgrade', 
                          (user.plan === 'Free' ? 'Basic' : 
                          user.plan === 'Basic' ? 'Pro' : 'Premium') as UserPlan
                        )}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        Upgrade Plan
                      </Button>
                    )}
                    {user.plan !== 'Free' && (
                      <Button 
                        variant="outline"
                        onClick={() => handleLockedFeatureClick('manage', user.plan as UserPlan)}
                        className="w-full"
                      >
                        Manage Billing
                      </Button>
                    )}
                  </div>

                  {/* Cancel Plan Section */}
                  {user.plan !== 'Free' && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <div className="bg-red-50 rounded-lg p-4">
                        <h4 className="font-medium text-red-900 mb-2">Cancel Plan</h4>
                        <p className="text-sm text-red-700 mb-3">
                          Cancelling your plan will immediately downgrade you to the Free plan. 
                          <strong> No refunds will be issued for any remaining time on your current plan.</strong>
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            onClick={() => setShowCancellationModal(true)}
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            Cancel Plan
                          </Button>
                          <span className="text-xs text-red-600 flex items-center">
                            <Shield className="h-3 w-3 mr-1" />
                            No refunds
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Billing Information */}
                  {user.plan !== 'Free' && user.planExpiry && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Billing Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700 font-medium">Billing Cycle:</span>
                          <p className="text-blue-600">
                            {(() => {
                              const expiryDate = new Date(user.planExpiry);
                              const now = new Date();
                              const diffTime = expiryDate.getTime() - now.getTime();
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              
                              if (diffDays > 365) return 'Yearly';
                              else if (diffDays > 30) return 'Monthly';
                              else return 'Trial';
                            })()}
                          </p>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Next Payment:</span>
                          <p className="text-blue-600">{new Date(user.planExpiry).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Amount:</span>
                          <p className="text-blue-600">
                            {(() => {
                              const expiryDate = new Date(user.planExpiry);
                              const now = new Date();
                              const diffTime = expiryDate.getTime() - now.getTime();
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              
                              if (diffDays > 365) {
                                return user.plan === 'Basic' ? '50 Pi/year' : 
                                       user.plan === 'Pro' ? '100 Pi/year' : '150 Pi/year';
                              } else {
                                return user.plan === 'Basic' ? '5 Pi/month' : 
                                       user.plan === 'Pro' ? '10 Pi/month' : '15 Pi/month';
                              }
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive updates via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.notifications.email}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        notifications: {...profileData.notifications, email: e.target.checked}
                      })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified in real-time</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.notifications.push}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        notifications: {...profileData.notifications, push: e.target.checked}
                      })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Receive text messages</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.notifications.sms}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        notifications: {...profileData.notifications, sms: e.target.checked}
                      })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Public Profile</h4>
                      <p className="text-sm text-gray-600">Allow others to see your profile</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.privacy.profilePublic}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        privacy: {...profileData.privacy, profilePublic: e.target.checked}
                      })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Share Progress</h4>
                      <p className="text-sm text-gray-600">Share your achievements with friends</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.privacy.shareProgress}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        privacy: {...profileData.privacy, shareProgress: e.target.checked}
                      })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Analytics</h4>
                      <p className="text-sm text-gray-600">Help improve Salenus A.I with usage data</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.privacy.allowAnalytics}
                      onChange={(e) => setProfileData({
                        ...profileData, 
                        privacy: {...profileData.privacy, allowAnalytics: e.target.checked}
                      })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Two-Factor Authentication
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Enhanced Payment Modal */}
      {!onUpgrade && (
        <PaymentModal
          isOpen={paymentOpen}
          plan={selectedPlan as UserPlan}
          onPay={handlePay}
          onChangePlan={handleChangePlan}
          isLoading={featureLoading}
        />
      )}
      
      {/* Enhanced Mobile Floating Action Button */}
      {isMobile && (
        <div className="fixed bottom-20 right-4 z-30">
          <Button
            size="lg"
            className="rounded-full shadow-lg w-16 h-16"
            onClick={() => setCurrentFeature('quick-add')}
            aria-label="Quick Add"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}
      
      {/* Enhanced Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex justify-around py-2 shadow-lg">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center text-xs text-slate-700" 
            onClick={() => handleFeatureNavigation('habits', 'habits')}
          >
            <BarChart3 className="h-5 w-5 mb-1" />
            Habits
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center text-xs text-slate-700" 
            onClick={() => handleFeatureNavigation('tasks', 'tasks')}
          >
            <ClipboardList className="h-5 w-5 mb-1" />
            Tasks
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center text-xs text-slate-700" 
            onClick={() => handleFeatureNavigation('challenges', 'challenges')}
          >
            <Users className="h-5 w-5 mb-1" />
            Challenges
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center text-xs text-slate-700" 
            onClick={() => handleFeatureNavigation('sync', 'sync')}
          >
            <Cloud className="h-5 w-5 mb-1" />
            Sync
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex flex-col items-center text-xs text-slate-700" 
            onClick={() => handleFeatureNavigation('mobile', 'mobile')}
          >
            <MobileIcon className="h-5 w-5 mb-1" />
            App
          </Button>
        </nav>
      )}
      
      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Keyboard Shortcuts</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowKeyboardShortcuts(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Ctrl+K</span>
                <span>Search</span>
              </div>
              <div className="flex justify-between">
                <span>Ctrl+B</span>
                <span>Toggle Sidebar</span>
              </div>
              <div className="flex justify-between">
                <span>Ctrl+H</span>
                <span>Habits</span>
              </div>
              <div className="flex justify-between">
                <span>Ctrl+T</span>
                <span>Tasks</span>
              </div>
              <div className="flex justify-between">
                <span>Ctrl+M</span>
                <span>Mood</span>
              </div>
              <div className="flex justify-between">
                <span>Ctrl+?</span>
                <span>Show Shortcuts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {showCancellationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-900">Cancel Plan</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCancellationModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-900">No Refund Policy</span>
                </div>
                <p className="text-sm text-red-700">
                  By cancelling your plan, you acknowledge that no refunds will be issued for any remaining time on your current billing cycle.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation (optional)
                </label>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Tell us why you're cancelling..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleCancelPlan}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Cancel Plan
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowCancellationModal(false)}
                  className="flex-1"
                >
                  Keep Plan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 