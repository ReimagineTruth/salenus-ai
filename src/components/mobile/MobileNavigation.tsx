import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  ListTodo, 
  Target, 
  BarChart3, 
  Settings,
  Plus,
  Bell,
  User,
  Calendar,
  BookOpen,
  Heart,
  Timer,
  MessageSquare,
  Camera,
  Share2,
  Download,
  Upload
} from 'lucide-react';

interface NavItem {
  icon: React.ComponentType<any>;
  label: string;
  href: string;
  badge?: number;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Home', href: '/mobile/dashboard' },
  { icon: ListTodo, label: 'Tasks', href: '/mobile/tasks', badge: 3 },
  { icon: Target, label: 'Goals', href: '/mobile/goals' },
  { icon: BarChart3, label: 'Analytics', href: '/mobile/analytics' },
  { icon: Settings, label: 'Settings', href: '/mobile/settings' }
];

const quickActions = [
  { icon: Plus, label: 'Add Task', href: '/mobile/tasks/add' },
  { icon: Camera, label: 'Photo', href: '/mobile/camera' },
  { icon: Timer, label: 'Timer', href: '/mobile/timer' },
  { icon: MessageSquare, label: 'Notes', href: '/mobile/notes' }
];

export const MobileNavigation: React.FC = () => {
  const location = useLocation();
  const [showQuickActions, setShowQuickActions] = React.useState(false);

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              } ${item.disabled ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.badge && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-50">
        <Button
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Quick Actions Menu */}
      {showQuickActions && (
        <div className="fixed bottom-32 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-2 space-y-2">
            {quickActions.map((action, index) => (
              <Link
                key={action.href}
                to={action.href}
                onClick={() => setShowQuickActions(false)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <action.icon className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Overlay to close quick actions */}
      {showQuickActions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowQuickActions(false)}
        />
      )}
    </>
  );
};

// Mobile Header Component
export const MobileHeader: React.FC<{
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}> = ({ title, subtitle, showBack = false, onBack, actions }) => {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
          )}
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

// Mobile Search Header
export const MobileSearchHeader: React.FC<{
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}> = ({ placeholder = "Search...", value, onChange, onClear }) => {
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {value && onClear && (
          <button
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Mobile Tab Navigation
export const MobileTabNavigation: React.FC<{
  tabs: { id: string; label: string; icon?: React.ComponentType<any> }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex space-x-1 px-4 py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon && <tab.icon className="h-4 w-4" />}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}; 