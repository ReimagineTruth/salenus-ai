import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  ClipboardList, 
  Users, 
  Heart, 
  Sparkles, 
  Star, 
  BookOpen, 
  Camera, 
  Trophy, 
  Flame, 
  MessageSquare, 
  PieChart, 
  Calendar, 
  Shield, 
  Lightbulb, 
  GraduationCap, 
  Globe, 
  Settings, 
  X, 
  LogOut, 
  Crown, 
  Key,
  User,
  Bell,
  Cloud,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth, UserPlan } from '@/hooks/useAuth';

interface MobileSidebarProps {
  user?: any;
  onClose: () => void;
  onLogout?: () => void;
  onUpgrade?: (plan: UserPlan) => void;
  onFeatureClick?: (featureName: string, route: string) => void;
}

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ 
  user, 
  onClose, 
  onLogout, 
  onUpgrade,
  onFeatureClick 
}) => {
  const navigate = useNavigate();
  const { hasFeature } = useAuth();

  const menuItems = [
    { label: 'Dashboard', icon: Home, route: '/dashboard', feature: null },
    { label: 'Habit Tracker', icon: BarChart3, route: '/dashboard/habits', feature: 'habit_tracking' },
    { label: 'Task Manager', icon: ClipboardList, route: '/dashboard/tasks', feature: 'task_management' },
    { label: 'Community', icon: Users, route: '/dashboard/community', feature: 'community_challenges' },
    { label: 'Cross-Platform Sync', icon: Cloud, route: '/dashboard/sync', feature: 'cross_platform_sync' },
    { label: 'Mobile App', icon: Smartphone, route: '/dashboard/mobile', feature: 'mobile_app' },
    { label: 'Notifications', icon: Bell, route: '/dashboard/notifications', feature: 'basic_notifications' },
    { label: 'Mood Tracker', icon: Heart, route: '/dashboard/mood', feature: 'mood_tracking' },
    { label: 'AI Coach', icon: Sparkles, route: '/dashboard/ai-coach', feature: 'ai_coaching' },
    { label: 'Analytics', icon: PieChart, route: '/dashboard/analytics', feature: 'advanced_analytics' },
    { label: 'Calendar', icon: Calendar, route: '/dashboard/calendar', feature: 'calendar_integration' },
    { label: 'Goals', icon: Star, route: '/dashboard/goals', feature: 'advanced_goals' },
    { label: 'Progress Photos', icon: Camera, route: '/dashboard/progress-photos', feature: 'progress_photos' },
    { label: 'Custom Challenges', icon: Trophy, route: '/dashboard/custom-challenges', feature: 'custom_challenges' },
    { label: 'Habit Journal', icon: BookOpen, route: '/dashboard/habit-journal', feature: 'habit_journal' },
    { label: 'Streak Protection', icon: Flame, route: '/dashboard/streak-protection', feature: 'streak_protection' },
    { label: 'Priority Support', icon: MessageSquare, route: '/dashboard/priority-support', feature: 'priority_support' },
    { label: 'VIP Support', icon: Shield, route: '/dashboard/vip-support', feature: 'vip_support' },
    { label: 'Exclusive Features', icon: Lightbulb, route: '/dashboard/exclusive-features', feature: 'exclusive_features' },
    { label: 'Personalized Courses', icon: GraduationCap, route: '/dashboard/personalized-courses', feature: 'personalized_courses' },
    { label: 'API Access', icon: Globe, route: '/dashboard/api-access', feature: 'api_access' },
    { label: 'White Label', icon: Settings, route: '/dashboard/white-label', feature: 'white_label' }
  ];

  const handleFeatureClick = (item: any) => {
    const hasAccess = !item.feature || hasFeature(item.feature);
    
    if (hasAccess) {
      navigate(item.route);
      onClose();
    } else {
      // Show upgrade prompt
      onUpgrade?.('Pro');
    }
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{user?.name || 'User'}</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Plan Status */}
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold text-gray-900">{user?.plan || 'Free'} Plan</span>
            </div>
            <Badge variant="secondary" className="text-xs">
              {user?.plan === 'Free' ? 'Basic' : user?.plan}
            </Badge>
          </div>
          {user?.planExpiry && user?.plan !== 'Free' && (
            <p className="text-xs text-gray-500 mt-1">
              Expires: {new Date(user.planExpiry).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const hasAccess = !item.feature || hasFeature(item.feature);
            
            return (
              <button
                key={item.label}
                onClick={() => handleFeatureClick(item)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  hasAccess 
                    ? 'text-gray-700 hover:bg-gray-100 active:bg-gray-200' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1 text-left font-medium">{item.label}</span>
                {!hasAccess && <Key className="h-4 w-4 flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Plan upgrade section */}
        {user?.plan === 'Free' && (
          <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Crown className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Upgrade Your Plan</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Unlock advanced features and personalized coaching
            </p>
            <Button 
              size="sm" 
              className="w-full bg-blue-600 hover:bg-blue-700"
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
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => {
              navigate('/dashboard/settings');
              onClose();
            }}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Button>
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
    </div>
  );
}; 