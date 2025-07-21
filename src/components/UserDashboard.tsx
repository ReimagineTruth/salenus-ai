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
import { FeatureLoader, Loader } from '@/components/ui/Loader';
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
  Search, 
  Plus, 
  Home, 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Settings as SettingsIcon, 
  User, 
  LogOut, 
  HelpCircle, 
  Keyboard, 
  MousePointer, 
  Monitor, 
  Smartphone as MobileIcon, 
  Download, 
  Upload, 
  Trash2, 
  Key, 
  Crown, 
  Zap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone as PhoneIcon,
  Database,
  FileText,
  HardDrive,
  AlertTriangle,
  CheckCircle,
  Clock,
  Archive,
  RotateCcw,
  Copy,
  ExternalLink,
  ArrowDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PiAdModal } from './PiAdModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { MobileLayout } from '@/components/MobileLayout';
import { MobileHabitTracker } from '@/components/mobile/MobileHabitTracker';
import { MobileTaskManager } from '@/components/mobile/MobileTaskManager';
import { MobileSidebar } from '@/components/mobile/MobileSidebar';
import { MobileFooterNavigation } from '@/components/MobileFooterNavigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Simple Fallback Component
const DashboardFallback: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h1>
        <p className="text-gray-600 mb-4">There was an error loading the dashboard. Please try refreshing the page.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

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
  const { upgradePlan, downgradePlan, isLoading, hasFeature, getPlanFeatures } = useAuth();
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

  // Debug logging
  console.log('UserDashboard rendered with user:', user);
  console.log('UserDashboard location:', location.pathname);
  console.log('UserDashboard isMobile:', isMobile);
  console.log('UserDashboard drawerOpen:', drawerOpen);
  console.log('UserDashboard window width:', window.innerWidth);

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

  // Add data management state
  const [showDataManagementModal, setShowDataManagementModal] = React.useState(false);
  const [dataManagementAction, setDataManagementAction] = React.useState<'export' | 'import' | 'backup' | 'reset' | null>(null);
  const [isDataActionLoading, setIsDataActionLoading] = React.useState(false);
  const [dataManagementStatus, setDataManagementStatus] = React.useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // Add confirmation dialog state
  const [showResetConfirmation, setShowResetConfirmation] = React.useState(false);
  const [resetConfirmationText, setResetConfirmationText] = React.useState('');
  const [showDataManagement, setShowDataManagement] = React.useState(false);
  const [showPiAdModal, setShowPiAdModal] = React.useState(false);

  React.useEffect(() => {
    localStorage.setItem('dashboardTab', activeTab);
  }, [activeTab]);

  // Show welcome message when dashboard loads
  React.useEffect(() => {
    if (user) {
      // Check if this is a fresh login (you could use a flag or timestamp)
      const lastLogin = localStorage.getItem('lastLogin');
      const now = new Date().toISOString();
      
      // Show welcome message if it's been more than 5 minutes since last login
      if (!lastLogin || (new Date(now).getTime() - new Date(lastLogin).getTime()) > 5 * 60 * 1000) {
        toast({
          title: "Welcome to your dashboard! 🎉",
          description: `Hello ${user.name || user.email?.split('@')[0]}, ready to continue your journey with Salenus A.I?`,
          duration: 4000,
        });
        localStorage.setItem('lastLogin', now);
      }
    }
  }, [user]);

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
    
    // Show processing toast
    toast({
      title: "Processing Upgrade...",
      description: `Upgrading to ${selectedPlan} plan...`,
      duration: 2000,
    });
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock payment success - update user plan
      await upgradePlan(selectedPlan as UserPlan);
      
      // Show success message with more details
      toast({
        title: "Upgrade Successful! 🎉",
        description: `Welcome to the ${selectedPlan} plan! You now have access to all premium features including ${getPlanFeatures(selectedPlan as UserPlan).slice(0, 3).join(', ')} and more!`,
        duration: 6000,
      });
      
      // Show additional welcome message
      setTimeout(() => {
        toast({
          title: "🎯 Getting Started",
          description: "Explore your new features in the dashboard. Try the habit tracker, task manager, or community challenges!",
          duration: 5000,
        });
      }, 2000);
      
      // Close payment modal
      setPaymentOpen(false);
      
      // Redirect to dashboard to ensure all new features are loaded
      setTimeout(() => {
        console.log('Redirecting to dashboard after plan upgrade...');
        window.location.href = '/dashboard';
      }, 500);
      
    } catch (error) {
      console.error('Mock payment error:', error);
      toast({
        title: "Upgrade Error",
        description: "There was an error processing your upgrade. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleChangePlan = () => {
    setPaymentOpen(false);
  };

  const handleDowngrade = async (newPlan: UserPlan) => {
    setFeatureLoading(true);
    try {
      await downgradePlan(newPlan);
      setPaymentOpen(false);
      setSelectedPlan(null);
      
      toast({
        title: "Plan Downgraded",
        description: `Your plan has been changed to ${newPlan}. Some features may no longer be available.`,
        duration: 4000,
      });
    } catch (error) {
      console.error('Downgrade error:', error);
      toast({
        title: "Downgrade Error",
        description: "There was an error processing your plan change. Please try again.",
        variant: "destructive"
      });
    } finally {
      setFeatureLoading(false);
    }
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

  const handleSignOut = async () => {
    try {
      console.log('UserDashboard: Starting sign out process...');
      console.log('UserDashboard: onLogout prop exists:', !!onLogout);
      
      // Clear any stored data first
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userSession');
      
      // Call the logout handler from props
      if (onLogout) {
        console.log('UserDashboard: Calling onLogout prop...');
        await onLogout();
        console.log('UserDashboard: onLogout completed');
      } else {
        // Fallback logout - clear user state and redirect
        console.log('UserDashboard: Using fallback logout...');
        
        // Clear user data from localStorage
        const keysToRemove = [
          'habits', 'tasks', 'piRewards', 'userProfile', 
          'currentUser', 'userSession', 'authToken'
        ];
        
        keysToRemove.forEach(key => {
          if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
          }
        });
        
        // Force redirect to home page
        console.log('UserDashboard: Redirecting to home...');
        window.location.href = '/';
      }
      
      console.log('UserDashboard: Sign out completed');
    } catch (error) {
      console.error('UserDashboard: Sign out error:', error);
      // Force redirect even if there's an error
      console.log('UserDashboard: Force redirect due to error...');
      window.location.href = '/';
    }
  };

  // Data Management Functions
  const handleExportData = async () => {
    setIsDataActionLoading(true);
    setDataManagementStatus(null);
    
    try {
      // Collect all user data
      const userData = {
        habits: JSON.parse(localStorage.getItem('habits') || '[]'),
        tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
        piRewards: JSON.parse(localStorage.getItem('piRewards') || '[]'),
        userProfile: {
          name: user?.name,
          email: user?.email,
          plan: user?.plan,
          settings: profileData
        },
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      // Create and download file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `salenus-ai-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDataManagementStatus({
        type: 'success',
        message: 'Data exported successfully!'
      });
      
      toast({
        title: "Export Complete",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      console.error('Export error:', error);
      setDataManagementStatus({
        type: 'error',
        message: 'Failed to export data. Please try again.'
      });
      
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    } finally {
      setIsDataActionLoading(false);
    }
  };

  const handleImportData = async (file: File) => {
    setIsDataActionLoading(true);
    setDataManagementStatus(null);
    
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      // Validate imported data structure
      if (!importedData.habits || !importedData.tasks || !importedData.piRewards) {
        throw new Error('Invalid backup file format');
      }

      // Import data to localStorage
      localStorage.setItem('habits', JSON.stringify(importedData.habits));
      localStorage.setItem('tasks', JSON.stringify(importedData.tasks));
      localStorage.setItem('piRewards', JSON.stringify(importedData.piRewards));
      
      // Update profile data if available
      if (importedData.userProfile?.settings) {
        setProfileData(importedData.userProfile.settings);
      }

      setDataManagementStatus({
        type: 'success',
        message: `Data imported successfully! ${importedData.habits.length} habits, ${importedData.tasks.length} tasks, and ${importedData.piRewards.length} Pi rewards imported.`
      });
      
      toast({
        title: "Import Complete",
        description: "Your data has been imported successfully.",
      });
    } catch (error) {
      console.error('Import error:', error);
      setDataManagementStatus({
        type: 'error',
        message: 'Failed to import data. Please check the file format.'
      });
      
      toast({
        title: "Import Failed",
        description: "There was an error importing your data. Please check the file format.",
        variant: "destructive"
      });
    } finally {
      setIsDataActionLoading(false);
    }
  };

  const handleBackupData = async () => {
    setIsDataActionLoading(true);
    setDataManagementStatus(null);
    
    try {
      // Create backup with timestamp
      const backupData = {
        habits: JSON.parse(localStorage.getItem('habits') || '[]'),
        tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
        piRewards: JSON.parse(localStorage.getItem('piRewards') || '[]'),
        userProfile: {
          name: user?.name,
          email: user?.email,
          plan: user?.plan,
          settings: profileData
        },
        backupDate: new Date().toISOString(),
        version: '1.0.0'
      };

      // Store backup in localStorage
      const backupKey = `backup_${new Date().toISOString().split('T')[0]}_${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(backupData));
      
      // Keep only last 5 backups
      const backupKeys = Object.keys(localStorage).filter(key => key.startsWith('backup_'));
      if (backupKeys.length > 5) {
        backupKeys.sort().slice(0, -5).forEach(key => localStorage.removeItem(key));
      }

      setDataManagementStatus({
        type: 'success',
        message: 'Backup created successfully!'
      });
      
      toast({
        title: "Backup Complete",
        description: "Your data has been backed up successfully.",
      });
    } catch (error) {
      console.error('Backup error:', error);
      setDataManagementStatus({
        type: 'error',
        message: 'Failed to create backup. Please try again.'
      });
      
      toast({
        title: "Backup Failed",
        description: "There was an error creating the backup.",
        variant: "destructive"
      });
    } finally {
      setIsDataActionLoading(false);
    }
  };

  const handleResetData = async () => {
    setIsDataActionLoading(true);
    setDataManagementStatus(null);
    
    try {
      // Clear all data
      localStorage.removeItem('habits');
      localStorage.removeItem('tasks');
      localStorage.removeItem('piRewards');
      
      // Clear backup data
      const backupKeys = Object.keys(localStorage).filter(key => key.startsWith('backup_'));
      backupKeys.forEach(key => localStorage.removeItem(key));

      setDataManagementStatus({
        type: 'success',
        message: 'All data has been reset successfully!'
      });
      
      toast({
        title: "Reset Complete",
        description: "All your data has been reset successfully.",
      });
    } catch (error) {
      console.error('Reset error:', error);
      setDataManagementStatus({
        type: 'error',
        message: 'Failed to reset data. Please try again.'
      });
      
      toast({
        title: "Reset Failed",
        description: "There was an error resetting your data.",
        variant: "destructive"
      });
    } finally {
      setIsDataActionLoading(false);
      setShowResetConfirmation(false);
    }
  };

  // Function to trigger reset confirmation
  const triggerResetConfirmation = () => {
    const stats = getDataStats();
    const confirmationMessage = `This will permanently delete:
• ${stats.habits} habits
• ${stats.tasks} tasks  
• ${stats.piRewards} Pi rewards
• ${stats.backups} backups

This action cannot be undone. Are you sure you want to continue?`;
    
    setResetConfirmationText(confirmationMessage);
    setShowResetConfirmation(true);
  };

  const getDataStats = () => {
    const habits = JSON.parse(localStorage.getItem('habits') || '[]');
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const piRewards = JSON.parse(localStorage.getItem('piRewards') || '[]');
    const backupKeys = Object.keys(localStorage).filter(key => key.startsWith('backup_'));
    
    return {
      habits: habits.length,
      tasks: tasks.length,
      piRewards: piRewards.length,
      backups: backupKeys.length,
      totalSize: new Blob([
        JSON.stringify(habits),
        JSON.stringify(tasks),
        JSON.stringify(piRewards)
      ]).size
    };
  };

  // Create demo data for testing
  const createDemoData = () => {
    const demoHabits = [
      {
        id: '1',
        name: 'Morning Exercise',
        category: 'Health',
        streak: 5,
        completed: false,
        target: 1,
        current: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Read 30 minutes',
        category: 'Learning',
        streak: 3,
        completed: false,
        target: 1,
        current: 0,
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Drink 8 glasses of water',
        category: 'Health',
        streak: 7,
        completed: false,
        target: 8,
        current: 0,
        createdAt: new Date().toISOString()
      }
    ];

    const demoTasks = [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Finish the quarterly project proposal document',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Work',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Grocery shopping',
        description: 'Buy groceries for the week',
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'Personal',
        createdAt: new Date().toISOString()
      }
    ];

    const demoPiRewards = [
      {
        id: '1',
        sessionType: 'Mining',
        duration: 30,
        piEarned: 0.5,
        date: new Date().toISOString(),
        status: 'completed'
      },
      {
        id: '2',
        sessionType: 'Trading',
        duration: 15,
        piEarned: 0.2,
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed'
      }
    ];

    localStorage.setItem('habits', JSON.stringify(demoHabits));
    localStorage.setItem('tasks', JSON.stringify(demoTasks));
    localStorage.setItem('piRewards', JSON.stringify(demoPiRewards));

    toast({
      title: "Demo Data Created",
      description: "Sample habits, tasks, and Pi rewards have been added. You can now test the data management features!",
    });
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
    // For free users trying to access habit tracker, show Pi ad modal
    if (feature === 'Habit Tracker' && user?.plan === 'Free') {
      setShowPiAdModal(true);
      setDrawerOpen(false);
      return;
    }
    
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
                              <Key className="h-4 w-4 mr-1" />
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
                  <Key className="h-8 w-8 text-gray-400" />
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
      
      {/* Pi Ad Modal for Free Users */}
      <PiAdModal
        isOpen={showPiAdModal}
        onClose={() => setShowPiAdModal(false)}
        onAdComplete={() => {
          console.log('Pi ad completed successfully');
          toast({
            title: "Ad Completed! 🎉",
            description: "You can now access the habit tracking app.",
            duration: 3000,
          });
        }}
        userPlan={user?.plan}
      />
    </div>
  );
};

  // Safety check for user data
  if (!user) {
    console.error('UserDashboard: No user data provided');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Dashboard Error</h1>
          <p className="text-gray-600 mb-4">No user data available. Please log in again.</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Enhanced Sidebar */}
      <Sheet open={drawerOpen} onOpenChange={(open) => {
        console.log('Sheet onOpenChange called with:', open);
        setDrawerOpen(open);
      }}>
        <SheetContent side="left" className="p-0 w-80 max-w-full">
          <MobileSidebar 
            user={user}
            onClose={() => {
              console.log('MobileSidebar onClose called');
              setDrawerOpen(false);
            }}
            onLogout={onLogout}
            onUpgrade={onUpgrade}
            onFeatureClick={handleFeatureNavigation}
          />
        </SheetContent>
      </Sheet>
      
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 min-h-screen mobile-scroll">
        {/* Enhanced Header with Mobile/Desktop optimizations */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-4 border-b border-slate-200 bg-white shadow-sm md:px-8 md:py-6 mobile-sticky">
          {/* Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log('Menu button clicked, current drawer state:', drawerOpen);
              console.log('isMobile:', isMobile);
              setDrawerOpen(true);
              console.log('Setting drawer to open');
            }}
            className="flex md:flex"
          >
            <Menu className="h-5 w-5" />
            {drawerOpen && <span className="ml-1 text-xs text-green-600">✓</span>}
          </Button>

          {/* Breadcrumb */}
          <div className="flex items-center space-x-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getBreadcrumbPath()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="hidden md:flex"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {user.name || user.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowSettings(true)}>
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowDataManagementModal(true)}>
                  <Database className="h-4 w-4 mr-2" />
                  Data Management
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowKeyboardShortcuts(true)}>
                  <Keyboard className="h-4 w-4 mr-2" />
                  Keyboard Shortcuts
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/help')}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8">
          {/* Welcome Message */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user.name || user.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-gray-600">
              Ready to continue your journey with Salenus A.I?
            </p>
          </div>

          {/* Plan Status and Upgrade Banner */}
          {(isExpired || isExpiringSoon) && (
            <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <Crown className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-900">
                      {isExpired ? 'Plan Expired' : 'Plan Expiring Soon'}
                    </h3>
                    <p className="text-sm text-orange-700">
                      {isExpired 
                        ? 'Your plan has expired. Upgrade to continue accessing premium features.'
                        : `Your plan expires in ${Math.ceil((new Date(user.planExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days.`
                      }
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => setPaymentOpen(true)}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {isExpired ? 'Renew Plan' : 'Upgrade Now'}
                </Button>
              </div>
            </div>
          )}

          {/* Welcome Banner for New Upgrades */}
          {user.hasPaid && user.plan !== 'Free' && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Crown className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">
                      Welcome to {user.plan}! 🎉
                    </h3>
                    <p className="text-sm text-green-700">
                      You now have access to premium features. Explore your new capabilities below!
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/dashboard/features')}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Explore Features
                </Button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Habits</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  8 completed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <Flame className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7 days</div>
                <p className="text-xs text-muted-foreground">
                  Personal best: 21 days
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Plan</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.plan}</div>
                {user.planExpiry && user.plan !== 'Free' && (
                  <p className="text-xs text-muted-foreground">
                    Expires: {new Date(user.planExpiry).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Data Management Quick Access - Collapsible */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Database className="h-5 w-5 mr-2" />
                    <div>
                      <CardTitle>Data Management</CardTitle>
                      <CardDescription>
                        Export, import, backup, and manage your data
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDataManagement(!showDataManagement)}
                    className="flex items-center space-x-1"
                  >
                    {showDataManagement ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        <span className="text-xs">Hide</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        <span className="text-xs">Show</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              {showDataManagement && (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col space-y-2"
                      onClick={handleExportData}
                      disabled={isDataActionLoading}
                    >
                      <Download className="w-6 h-6" />
                      <span className="text-sm">Export Data</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col space-y-2"
                      onClick={() => setShowDataManagementModal(true)}
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-sm">Import Data</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col space-y-2"
                      onClick={handleBackupData}
                      disabled={isDataActionLoading}
                    >
                      {isDataActionLoading ? (
                        <Loader size="sm" message="Backing up..." />
                      ) : (
                        <Archive className="w-6 h-6" />
                      )}
                      <span className="text-sm">Create Backup</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex-col space-y-2"
                      onClick={() => setShowDataManagementModal(true)}
                    >
                      <Database className="w-6 h-6" />
                      <span className="text-sm">Manage Data</span>
                    </Button>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <strong>Quick Stats:</strong> {getDataStats().habits} habits, {getDataStats().tasks} tasks, {getDataStats().piRewards} Pi rewards, {getDataStats().backups} backups
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={createDemoData}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Demo Data
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Nested Routes for Dashboard Features */}
          <div className="px-4 md:px-6 pb-6 mobile-safe-area">
            <Routes>
              {/* Dashboard Overview */}
              <Route path="/" element={
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
                    <p className="text-gray-600 mb-4">Select a feature from the sidebar to get started.</p>
                    
                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allFeatures.map((feature) => (
                        <FeatureCard
                          key={feature.featureKey}
                          title={feature.title}
                          description={feature.description}
                          icon={feature.icon}
                          featureKey={feature.featureKey}
                          requiredPlan={feature.requiredPlan as UserPlan}
                          userPlan={user?.plan}
                          isLocked={!hasPlanAccess(feature.requiredPlan)}
                          onUpgrade={() => setPaymentOpen(true)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              } />
            
            {/* Habit Tracker */}
            <Route path="/habits" element={
              hasPlanAccess('Basic') ? (
                <HabitTracker />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Habit Tracker",
                  description: "Track your daily habits and build streaks",
                  requiredPlan: "Basic",
                  icon: <BarChart3 className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Task Manager */}
            <Route path="/tasks" element={
              hasPlanAccess('Basic') ? (
                <TaskManager />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Task Manager",
                  description: "Manage your tasks and to-dos",
                  requiredPlan: "Basic",
                  icon: <ClipboardList className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Community Challenges */}
            <Route path="/challenges" element={
              hasPlanAccess('Basic') ? (
                <CommunityChallenges />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Community Challenges",
                  description: "Join community challenges and compete",
                  requiredPlan: "Basic",
                  icon: <Users className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Cross Platform Sync */}
            <Route path="/sync" element={
              hasPlanAccess('Basic') ? (
                <CrossPlatformSync />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Cross Platform Sync",
                  description: "Sync your data across devices",
                  requiredPlan: "Basic",
                  icon: <Cloud className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Mobile App Access */}
            <Route path="/mobile" element={
              hasPlanAccess('Basic') ? (
                <MobileAppAccess />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Mobile App Access",
                  description: "Access the app on mobile devices",
                  requiredPlan: "Basic",
                  icon: <Smartphone className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Basic Notifications */}
            <Route path="/notifications" element={
              hasPlanAccess('Basic') ? (
                <BasicNotifications />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Basic Notifications",
                  description: "Receive notifications and reminders",
                  requiredPlan: "Basic",
                  icon: <Bell className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Mood Tracker */}
            <Route path="/mood" element={
              hasPlanAccess('Pro') ? (
                <MoodTracker />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Mood Tracker",
                  description: "Track your mood and get insights",
                  requiredPlan: "Pro",
                  icon: <Heart className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Free Habit Preview */}
            <Route path="/free-preview" element={
              hasPlanAccess('Free') ? (
                <TestFeature 
                  featureName="Free Habit Preview" 
                  description="Preview basic habit tracking. Upgrade to unlock full functionality." 
                  icon={<BarChart3 className="h-8 w-8" />} 
                  color="bg-gray-100" 
                />
              ) : (
                <Navigate to="/" replace />
              )
            } />
            
            {/* Pi Network Integration */}
            <Route path="/pi-network" element={
              hasPlanAccess('Free') ? (
                <TestFeature 
                  featureName="Pi Network Integration" 
                  description="Access Pi Network features and earn Pi cryptocurrency." 
                  icon={<Users className="h-8 w-8" />} 
                  color="bg-yellow-100" 
                />
              ) : (
                <Navigate to="/" replace />
              )
            } />
            
            {/* Advanced Goal Setting */}
            <Route path="/goals" element={
              hasPlanAccess('Pro') ? (
                <AdvancedGoalSetting onUpgrade={() => setPaymentOpen(true)} />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Advanced Goal Setting",
                  description: "Set complex goals with milestones",
                  requiredPlan: "Pro",
                  icon: <Star className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Habit Journal */}
            <Route path="/journal" element={
              hasPlanAccess('Pro') ? (
                <HabitJournal onUpgrade={() => setPaymentOpen(true)} />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Habit Journal",
                  description: "Journal your habit journey",
                  requiredPlan: "Pro",
                  icon: <BookOpen className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Progress Photos */}
            <Route path="/photos" element={
              hasPlanAccess('Pro') ? (
                <ProgressPhotos onUpgrade={() => setPaymentOpen(true)} />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Progress Photos",
                  description: "Track progress with photos",
                  requiredPlan: "Pro",
                  icon: <Camera className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Custom Challenges */}
            <Route path="/custom-challenges" element={
              hasPlanAccess('Pro') ? (
                <CustomChallenges onUpgrade={() => setPaymentOpen(true)} />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Custom Challenges",
                  description: "Create custom challenges",
                  requiredPlan: "Pro",
                  icon: <Trophy className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Streak Protection */}
            <Route path="/streak-protection" element={
              hasPlanAccess('Pro') ? (
                <StreakProtection onUpgrade={() => setPaymentOpen(true)} />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Streak Protection",
                  description: "Protect your streaks",
                  requiredPlan: "Pro",
                  icon: <Flame className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Smart Reminders */}
            <Route path="/smart-reminders" element={
              hasPlanAccess('Pro') ? (
                <SmartReminders onUpgrade={() => setPaymentOpen(true)} />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Smart Reminders",
                  description: "AI-powered reminders",
                  requiredPlan: "Pro",
                  icon: <Bell className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Priority Support */}
            <Route path="/support" element={
              hasPlanAccess('Pro') ? (
                <PrioritySupport onUpgrade={() => setPaymentOpen(true)} />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Priority Support",
                  description: "Get priority customer support",
                  requiredPlan: "Pro",
                  icon: <MessageSquare className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* AI Coach */}
            <Route path="/ai-coach" element={
              hasPlanAccess('Premium') ? (
                <AICoach />
              ) : (
                <LockedFeature featureInfo={{
                  name: "AI Personal Coach",
                  description: "Get personalized AI coaching",
                  requiredPlan: "Premium",
                  icon: <Sparkles className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Advanced Analytics */}
            <Route path="/analytics" element={
              hasPlanAccess('Premium') ? (
                <AdvancedAnalytics onUpgrade={() => setPaymentOpen(true)} />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Advanced Analytics",
                  description: "Deep insights and analytics",
                  requiredPlan: "Premium",
                  icon: <PieChart className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Calendar Integration */}
            <Route path="/calendar" element={
              hasPlanAccess('Premium') ? (
                <CalendarIntegration onUpgrade={() => setPaymentOpen(true)} />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Calendar Integration",
                  description: "Integrate with your calendar",
                  requiredPlan: "Premium",
                  icon: <Calendar className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* VIP Support */}
            <Route path="/vip-support" element={
              hasPlanAccess('Premium') ? (
                <VIPSupport onUpgrade={() => setPaymentOpen(true)} />
              ) : (
                <LockedFeature featureInfo={{
                  name: "VIP Support",
                  description: "24/7 VIP customer support",
                  requiredPlan: "Premium",
                  icon: <Shield className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Exclusive Features */}
            <Route path="/exclusive" element={
              hasPlanAccess('Premium') ? (
                <ExclusiveFeatures onUpgrade={() => setPaymentOpen(true)} />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Exclusive Features",
                  description: "Access exclusive features",
                  requiredPlan: "Premium",
                  icon: <Lightbulb className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Personalized Courses */}
            <Route path="/courses" element={
              hasPlanAccess('Premium') ? (
                <PersonalizedCourses onUpgrade={() => setPaymentOpen(true)} />
              ) : (
                <LockedFeature featureInfo={{
                  name: "Personalized Courses",
                  description: "AI-curated learning paths",
                  requiredPlan: "Premium",
                  icon: <GraduationCap className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* API Access */}
            <Route path="/api" element={
              hasPlanAccess('Premium') ? (
                <APIAccess onUpgrade={() => setPaymentOpen(true)} />
              ) : (
                <LockedFeature featureInfo={{
                  name: "API Access",
                  description: "Developer API access",
                  requiredPlan: "Premium",
                  icon: <Globe className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* White Label */}
            <Route path="/white-label" element={
              hasPlanAccess('Premium') ? (
                <WhiteLabel onUpgrade={() => setPaymentOpen(true)} />
              ) : (
                <LockedFeature featureInfo={{
                  name: "White Label",
                  description: "Custom branding options",
                  requiredPlan: "Premium",
                  icon: <Settings className="h-8 w-8" />
                }} />
              )
            } />
            
            {/* Catch-all route for unknown paths */}
            <Route path="*" element={
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 text-center">
                  <h2 className="text-xl font-semibold mb-4">Feature Not Found</h2>
                  <p className="text-gray-600 mb-4">The requested feature could not be found.</p>
                  <Button onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                  </Button>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </div>
      </main>
      
      {/* Enhanced Payment Modal */}
      {!onUpgrade && (
        <PaymentModal
          isOpen={paymentOpen}
          plan={selectedPlan as UserPlan}
          onPay={handlePay}
          onChangePlan={handleChangePlan}
          onDowngrade={handleDowngrade}
          isLoading={featureLoading}
          currentPlan={user?.plan}
          showDowngrade={true}
        />
      )}

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5" />
              <span>Settings</span>
            </DialogTitle>
            <DialogDescription>
              Manage your account settings and preferences
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="avatar">Profile Picture</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {profileData.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <Button variant="outline">Upload Photo</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={profileData.notifications.email}
                    onCheckedChange={(checked) => setProfileData({
                      ...profileData,
                      notifications: {...profileData.notifications, email: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-500">Receive push notifications</p>
                  </div>
                  <Switch
                    checked={profileData.notifications.push}
                    onCheckedChange={(checked) => setProfileData({
                      ...profileData,
                      notifications: {...profileData.notifications, push: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={profileData.notifications.sms}
                    onCheckedChange={(checked) => setProfileData({
                      ...profileData,
                      notifications: {...profileData.notifications, sms: checked}
                    })}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Profile</Label>
                    <p className="text-sm text-gray-500">Allow others to see your profile</p>
                  </div>
                  <Switch
                    checked={profileData.privacy.profilePublic}
                    onCheckedChange={(checked) => setProfileData({
                      ...profileData,
                      privacy: {...profileData.privacy, profilePublic: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Share Progress</Label>
                    <p className="text-sm text-gray-500">Share your progress with friends</p>
                  </div>
                  <Switch
                    checked={profileData.privacy.shareProgress}
                    onCheckedChange={(checked) => setProfileData({
                      ...profileData,
                      privacy: {...profileData.privacy, shareProgress: checked}
                    })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics</Label>
                    <p className="text-sm text-gray-500">Allow analytics and improvements</p>
                  </div>
                  <Switch
                    checked={profileData.privacy.allowAnalytics}
                    onCheckedChange={(checked) => setProfileData({
                      ...profileData,
                      privacy: {...profileData.privacy, allowAnalytics: checked}
                    })}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-4">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Current Plan: {user.plan}</h4>
                      {user.planExpiry && user.plan !== 'Free' && (
                        <p className="text-sm text-gray-500">
                          Expires: {new Date(user.planExpiry).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary">{user.plan}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button 
                    onClick={() => {
                      setSelectedPlan('Premium');
                      setPaymentOpen(true);
                      setShowSettings(false);
                    }}
                    className="w-full"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                  {user.plan !== 'Free' && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedPlan('Free');
                          setPaymentOpen(true);
                          setShowSettings(false);
                        }}
                        className="w-full text-orange-600 hover:text-orange-700"
                      >
                        <ArrowDown className="h-4 w-4 mr-2" />
                        Downgrade to Free
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowCancellationModal(true)}
                        className="w-full text-red-600 hover:text-red-700"
                      >
                        Cancel Subscription
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
              <div className="space-y-4">
                {/* Data Statistics */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Data Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{getDataStats().habits}</div>
                      <div className="text-sm text-gray-600">Habits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{getDataStats().tasks}</div>
                      <div className="text-sm text-gray-600">Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{getDataStats().piRewards}</div>
                      <div className="text-sm text-gray-600">Pi Rewards</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{getDataStats().backups}</div>
                      <div className="text-sm text-gray-600">Backups</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    Total data size: {(getDataStats().totalSize / 1024).toFixed(2)} KB
                  </div>
                </div>

                {/* Export Data */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Download className="h-5 w-5 text-blue-600" />
                    <div>
                      <Label className="text-base font-medium">Export Data</Label>
                      <p className="text-sm text-gray-500">Export all your habits, tasks, and Pi rewards to a JSON file.</p>
                    </div>
                  </div>
                  <Button onClick={handleExportData} disabled={isDataActionLoading} className="w-full">
                    {isDataActionLoading ? (
                      <Loader size="sm" message="Exporting..." />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Export Data
                  </Button>
                </div>

                {/* Import Data */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Upload className="h-5 w-5 text-green-600" />
                    <div>
                      <Label htmlFor="import-file" className="text-base font-medium">Import Data</Label>
                      <p className="text-sm text-gray-500">Import your habits, tasks, and Pi rewards from a JSON file.</p>
                    </div>
                  </div>
                  <Input
                    type="file"
                    id="import-file"
                    accept=".json"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleImportData(e.target.files[0]);
                      }
                    }}
                    disabled={isDataActionLoading}
                  />
                </div>

                {/* Create Backup */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Archive className="h-5 w-5 text-orange-600" />
                    <div>
                      <Label className="text-base font-medium">Create Backup</Label>
                      <p className="text-sm text-gray-500">Create a backup of your current data to restore later.</p>
                    </div>
                  </div>
                  <Button onClick={handleBackupData} disabled={isDataActionLoading} className="w-full">
                    {isDataActionLoading ? (
                      <Loader size="sm" message="Backing up..." />
                    ) : (
                      <Archive className="h-4 w-4 mr-2" />
                    )}
                    Create Backup
                  </Button>
                </div>

                {/* Reset Data */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Trash2 className="h-5 w-5 text-red-600" />
                    <div>
                      <Label className="text-base font-medium">Reset Data</Label>
                      <p className="text-sm text-gray-500">This action will permanently delete all your habits, tasks, and Pi rewards. This cannot be undone.</p>
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={triggerResetConfirmation} 
                    disabled={isDataActionLoading}
                    className="w-full"
                  >
                    {isDataActionLoading ? (
                      <Loader size="sm" message="Resetting..." />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Reset Data
                  </Button>
                </div>

                {/* Status Messages */}
                {dataManagementStatus && (
                  <div className={`mt-4 p-3 rounded-md ${
                    dataManagementStatus.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {dataManagementStatus.type === 'success' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      <span>{dataManagementStatus.message}</span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Settings saved",
                description: "Your settings have been updated successfully.",
              });
              setShowSettings(false);
            }}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Keyboard Shortcuts Modal */}
      <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Keyboard className="h-5 w-5" />
              <span>Keyboard Shortcuts</span>
            </DialogTitle>
            <DialogDescription>
              Use these keyboard shortcuts to navigate faster
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Navigation</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Go to Dashboard</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Ctrl + D</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Go to Habits</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Ctrl + H</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Go to Tasks</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Ctrl + T</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Go to Analytics</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Ctrl + A</kbd>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Actions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Add New Item</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Ctrl + N</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Search</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Ctrl + K</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Settings</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Ctrl + ,</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Help</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">F1</kbd>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Quick Actions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mark Habit Complete</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Space</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Toggle Sidebar</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">Ctrl + B</kbd>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Refresh Data</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">F5</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fullscreen</span>
                    <kbd className="px-2 py-1 text-xs bg-gray-100 rounded">F11</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button onClick={() => setShowKeyboardShortcuts(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancellation Modal */}
      <Dialog open={showCancellationModal} onOpenChange={setShowCancellationModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? You'll lose access to premium features.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for cancellation (optional)</Label>
              <textarea
                id="reason"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Tell us why you're cancelling..."
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCancellationModal(false)}>
              Keep Subscription
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                toast({
                  title: "Subscription cancelled",
                  description: "Your subscription has been cancelled. You can reactivate anytime.",
                });
                setShowCancellationModal(false);
              }}
            >
              Cancel Subscription
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Data Management Modal */}
      <Dialog open={showDataManagementModal} onOpenChange={setShowDataManagementModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Data Management</span>
            </DialogTitle>
            <DialogDescription>
              Export, import, backup, and reset your application data.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="export" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="export">Export Data</TabsTrigger>
              <TabsTrigger value="import">Import Data</TabsTrigger>
              <TabsTrigger value="backup">Create Backup</TabsTrigger>
              <TabsTrigger value="reset">Reset Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="export" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Export Data</Label>
                  <p className="text-sm text-gray-500">Export all your habits, tasks, and Pi rewards to a JSON file.</p>
                </div>
                <Button onClick={handleExportData} disabled={isDataActionLoading}>
                  {isDataActionLoading ? (
                    <Loader size="sm" message="Exporting..." />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export Data
                </Button>
                {dataManagementStatus && (
                  <div className={`mt-4 p-3 rounded-md ${dataManagementStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {dataManagementStatus.message}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="import" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="import-file">Import Data</Label>
                  <p className="text-sm text-gray-500">Import your habits, tasks, and Pi rewards from a JSON file.</p>
                  <Input
                    type="file"
                    id="import-file"
                    accept=".json"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleImportData(e.target.files[0]);
                      }
                    }}
                    disabled={isDataActionLoading}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="backup" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Create Backup</Label>
                  <p className="text-sm text-gray-500">Create a backup of your current data to restore later.</p>
                </div>
                <Button onClick={handleBackupData} disabled={isDataActionLoading}>
                  {isDataActionLoading ? (
                    <Loader size="sm" message="Backing up..." />
                  ) : (
                    <Archive className="h-4 w-4 mr-2" />
                  )}
                  Create Backup
                </Button>
                {dataManagementStatus && (
                  <div className={`mt-4 p-3 rounded-md ${dataManagementStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {dataManagementStatus.message}
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="reset" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Reset Data</Label>
                  <p className="text-sm text-gray-500">This action will permanently delete all your habits, tasks, and Pi rewards. This cannot be undone.</p>
                </div>
                <Button 
                  variant="destructive" 
                  onClick={triggerResetConfirmation} 
                  disabled={isDataActionLoading}
                >
                  {isDataActionLoading ? (
                    <Loader size="sm" message="Resetting..." />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Reset Data
                </Button>
                {dataManagementStatus && (
                  <div className={`mt-4 p-3 rounded-md ${dataManagementStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    {dataManagementStatus.message}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowDataManagementModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              toast({
                title: "Data management complete",
                description: "Your data management actions have been completed.",
              });
              setShowDataManagementModal(false);
            }}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Data Confirmation Modal */}
      <Dialog open={showResetConfirmation} onOpenChange={setShowResetConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span>Confirm Data Reset</span>
            </DialogTitle>
            <DialogDescription>
              This action will permanently delete all your data. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800">Warning: Irreversible Action</h4>
                  <p className="text-sm text-red-700 mt-1">
                    This will permanently delete all your habits, tasks, Pi rewards, and backups. 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {resetConfirmationText}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="confirm-reset"
                className="rounded border-gray-300"
                required
              />
              <label htmlFor="confirm-reset" className="text-sm text-gray-700">
                I understand that this action cannot be undone
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowResetConfirmation(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleResetData}
              disabled={isDataActionLoading}
            >
              {isDataActionLoading ? (
                <Loader size="sm" message="Deleting..." />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete All Data
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Footer Navigation */}
      <MobileFooterNavigation 
        onAddClick={() => {
          // Handle add button click based on current route
          const currentPath = location.pathname;
          if (currentPath.includes('/habits')) {
            // Open add habit form
            toast({
              title: "Add Habit",
              description: "Click the 'Add Habit' button in the habit tracker to create a new habit.",
            });
          } else if (currentPath.includes('/tasks')) {
            // Open add task form
            toast({
              title: "Add Task",
              description: "Click the 'Add Task' button in the task manager to create a new task.",
            });
          } else {
            // Default add action
            toast({
              title: "Quick Add",
              description: "Navigate to a specific section to add items.",
            });
          }
        }}
        showAddButton={true}
      />
    </div>
  );
}; 