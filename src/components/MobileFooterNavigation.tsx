import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Target, 
  ListTodo, 
  Pi, 
  Settings, 
  User,
  BarChart3,
  Calendar,
  Bell,
  Plus
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface MobileFooterNavigationProps {
  onAddClick?: () => void;
  showAddButton?: boolean;
}

export const MobileFooterNavigation: React.FC<MobileFooterNavigationProps> = ({
  onAddClick,
  showAddButton = true
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/dashboard',
      badge: null
    },
    {
      id: 'habits',
      label: 'Habits',
      icon: Target,
      path: '/dashboard/habits',
      badge: user?.plan === 'Basic' ? 'Free' : null
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: ListTodo,
      path: '/dashboard/tasks',
      badge: null
    },
    {
      id: 'pi-network',
      label: 'Pi Network',
      icon: Pi,
      path: '/dashboard/pi-network',
      badge: 'Free'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/dashboard/analytics',
      badge: user?.plan === 'Basic' ? 'Pro' : null
    }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleAddClick = () => {
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
    } else if (currentPath.includes('/pi-network')) {
      // Open add Pi session form
      toast({
        title: "Start Pi Session",
        description: "Click the 'Start Session' button in the Pi Network tracker to begin mining.",
      });
    } else {
      // Default add action - navigate to habits
      navigate('/dashboard/habits');
      toast({
        title: "Navigate to Habits",
        description: "Go to the Habits section to add new habits.",
      });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
      {/* Add Button - Floating Action Button */}
      {showAddButton && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
          <Button
            onClick={handleAddClick}
            className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex items-center justify-around px-2 py-3">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.path);
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-1 min-w-0 ${
                active 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <div className="relative">
                <IconComponent className="h-5 w-5" />
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-1 -right-1 text-xs px-1 py-0 h-4"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Bottom Safe Area for iOS */}
      <div className="h-4 bg-white" />
    </div>
  );
}; 