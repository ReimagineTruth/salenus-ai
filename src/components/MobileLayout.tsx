import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  ClipboardList, 
  User, 
  Settings, 
  Menu, 
  X, 
  Search, 
  Bell, 
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Heart,
  Star,
  Trophy,
  Calendar,
  MessageSquare,
  Sparkles,
  Shield,
  Lightbulb,
  GraduationCap,
  Globe,
  Crown,
  Zap,
  Lock,
  Unlock,
  Users,
  PieChart,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth, UserPlan } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileLayoutProps {
  children: React.ReactNode;
  user?: any;
  onLogout?: () => void;
  onUpgrade?: (plan: UserPlan) => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  onUpgrade 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { hasFeature, upgradePlan } = useAuth();
  
  // Mobile-specific state
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullToRefreshY, setPullToRefreshY] = useState(0);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Habit Reminder', message: 'Time to check your habits!', time: '2m ago', unread: true },
    { id: 2, title: 'Task Due', message: 'Complete project review', time: '1h ago', unread: true },
    { id: 3, title: 'Streak Milestone', message: '7-day streak achieved!', time: '3h ago', unread: false }
  ]);

  // Touch gesture refs
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);

  // Mobile navigation tabs
  const mobileTabs = [
    { id: 'home', label: 'Home', icon: Home, route: '/dashboard' },
    { id: 'habits', label: 'Habits', icon: BarChart3, route: '/dashboard/habits' },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList, route: '/dashboard/tasks' },
    { id: 'profile', label: 'Profile', icon: User, route: '/dashboard/profile' }
  ];

  // Quick actions for floating action button
  const quickActions = [
    { id: 'add-habit', label: 'Add Habit', icon: Plus, action: () => navigate('/dashboard/habits') },
    { id: 'add-task', label: 'Add Task', icon: ClipboardList, action: () => navigate('/dashboard/tasks') },
    { id: 'take-photo', label: 'Progress Photo', icon: Upload, action: () => navigate('/dashboard/progress-photos') },
    { id: 'journal', label: 'Journal Entry', icon: MessageSquare, action: () => navigate('/dashboard/habit-journal') }
  ];

  // Handle pull-to-refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const startY = touchStartRef.current.y;
    const deltaY = currentY - startY;
    
    // Only allow pull-to-refresh if at top of page
    if (window.scrollY === 0 && deltaY > 0) {
      setPullToRefreshY(Math.min(deltaY * 0.5, 100));
    }
  };

  const handleTouchEnd = () => {
    if (pullToRefreshY > 50) {
      handleRefresh();
    }
    setPullToRefreshY(0);
    touchStartRef.current = null;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      // Refresh data here
    }, 1000);
  };

  // Handle swipe gestures
  const handleSwipe = (direction: 'left' | 'right') => {
    const currentIndex = mobileTabs.findIndex(tab => tab.id === activeTab);
    
    if (direction === 'left' && currentIndex < mobileTabs.length - 1) {
      const nextTab = mobileTabs[currentIndex + 1];
      setActiveTab(nextTab.id);
      navigate(nextTab.route);
    } else if (direction === 'right' && currentIndex > 0) {
      const prevTab = mobileTabs[currentIndex - 1];
      setActiveTab(prevTab.id);
      navigate(prevTab.route);
    }
  };

  // Handle tab navigation
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const tab = mobileTabs.find(t => t.id === tabId);
    if (tab) {
      navigate(tab.route);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality
  };

  // Handle notifications
  const handleNotificationPress = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, unread: false } : n)
    );
  };

  // Handle quick action
  const handleQuickAction = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId);
    if (action) {
      action.action();
    }
    setShowQuickActions(false);
  };

  // Update active tab based on current route
  useEffect(() => {
    const currentTab = mobileTabs.find(tab => location.pathname.startsWith(tab.route));
    if (currentTab) {
      setActiveTab(currentTab.id);
    }
  }, [location.pathname]);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Pull-to-refresh indicator */}
      {pullToRefreshY > 0 && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-blue-500 text-white py-2"
          style={{ transform: `translateY(${pullToRefreshY}px)` }}
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <MobileSidebar 
                  user={user}
                  onClose={() => setSidebarOpen(false)}
                  onLogout={onLogout}
                  onUpgrade={onUpgrade}
                />
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-gray-900">Salenus AI</h1>
              {user?.plan !== 'Free' && (
                <Badge variant="secondary" className="text-xs">
                  {user?.plan}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 relative"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="p-2 relative"
              onClick={() => {/* Open notifications */}}
            >
              <Bell className="h-5 w-5" />
              {notifications.filter(n => n.unread).length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                  {notifications.filter(n => n.unread).length}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="mt-3">
            <Input
              placeholder="Search habits, tasks, features..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
          </div>
        )}
      </header>

      {/* Main content */}
      <main 
        className="flex-1 overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="p-4">
          {children}
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex items-center justify-around">
          {mobileTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-50">
        <div className="relative">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowQuickActions(!showQuickActions)}
          >
            <Plus className="h-6 w-6" />
          </Button>

          {/* Quick actions menu */}
          {showQuickActions && (
            <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-48">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">{action.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Notifications panel */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            <Button variant="ghost" size="sm" className="text-xs">
              Mark all read
            </Button>
          </div>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationPress(notification.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  notification.unread ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                  </div>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Mobile Sidebar Component
const MobileSidebar: React.FC<{
  user?: any;
  onClose: () => void;
  onLogout?: () => void;
  onUpgrade?: (plan: UserPlan) => void;
}> = ({ user, onClose, onLogout, onUpgrade }) => {
  const navigate = useNavigate();
  const { hasFeature } = useAuth();

  const menuItems = [
    { label: 'Dashboard', icon: Home, route: '/dashboard' },
    { label: 'Habit Tracker', icon: BarChart3, route: '/dashboard/habits', feature: 'habit_tracking' },
    { label: 'Task Manager', icon: ClipboardList, route: '/dashboard/tasks', feature: 'task_management' },
    { label: 'Community', icon: Users, route: '/dashboard/community', feature: 'community_challenges' },
    { label: 'Mood Tracker', icon: Heart, route: '/dashboard/mood', feature: 'mood_tracking' },
    { label: 'AI Coach', icon: Sparkles, route: '/dashboard/ai-coach', feature: 'ai_coaching' },
    { label: 'Analytics', icon: PieChart, route: '/dashboard/analytics', feature: 'advanced_analytics' },
    { label: 'Calendar', icon: Calendar, route: '/dashboard/calendar', feature: 'calendar_integration' },
    { label: 'Settings', icon: Settings, route: '/dashboard/settings' }
  ];

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <Badge variant="secondary" className="text-xs mt-1">
                {user?.plan || 'Free'} Plan
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasAccess = !item.feature || hasFeature(item.feature);
            
            return (
              <button
                key={item.label}
                onClick={() => {
                  if (hasAccess) {
                    navigate(item.route);
                    onClose();
                  } else {
                    // Show upgrade prompt
                    onUpgrade?.('Pro');
                  }
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  hasAccess 
                    ? 'text-gray-700 hover:bg-gray-100' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1 text-left">{item.label}</span>
                {!hasAccess && <Key className="h-4 w-4" />}
              </button>
            );
          })}
        </div>

        {/* Plan upgrade section */}
        {user?.plan === 'Free' && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Upgrade Your Plan</h4>
            <p className="text-sm text-gray-600 mb-3">
              Unlock advanced features and personalized coaching
            </p>
            <Button 
              size="sm" 
              className="w-full"
              onClick={() => {
                onUpgrade?.('Basic');
                onClose();
              }}
            >
              Upgrade Now
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={() => {
            onLogout?.();
            onClose();
          }}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}; 
