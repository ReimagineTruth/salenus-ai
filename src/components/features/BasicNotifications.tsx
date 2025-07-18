import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Clock, CheckCircle, Calendar, Zap, Bell, Sun, Settings, Moon, Smartphone, Monitor } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DataService } from '@/lib/data-service';

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
  category: 'habits' | 'tasks' | 'reminders' | 'system';
  time?: string;
  frequency?: 'daily' | 'weekly' | 'custom';
}

interface NotificationSchedule {
  id: string;
  name: string;
  time: string;
  days: string[];
  enabled: boolean;
}

// Helper function to get icon for a notification setting
const getNotificationIcon = (id: string) => {
  switch (id) {
    case 'habit-reminders':
      return <CheckCircle className="h-4 w-4" />;
    case 'task-deadlines':
      return <Calendar className="h-4 w-4" />;
    case 'streak-alerts':
      return <Zap className="h-4 w-4" />;
    case 'weekly-reports':
      return <Clock className="h-4 w-4" />;
    case 'challenge-updates':
      return <Bell className="h-4 w-4" />;
    case 'motivational-messages':
      return <Sun className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

export const BasicNotifications: React.FC = () => {
  const { user } = useAuth();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'habit-reminders',
      name: 'Habit Reminders',
      description: 'Get reminded to complete your daily habits',
      enabled: true,
      icon: <CheckCircle className="h-4 w-4" />,
      category: 'habits',
      time: '09:00',
      frequency: 'daily'
    },
    {
      id: 'task-deadlines',
      name: 'Task Deadlines',
      description: 'Receive alerts for upcoming task deadlines',
      enabled: true,
      icon: <Calendar className="h-4 w-4" />,
      category: 'tasks',
      time: '18:00',
      frequency: 'daily'
    },
    {
      id: 'streak-alerts',
      name: 'Streak Alerts',
      description: 'Celebrate your habit streaks and milestones',
      enabled: true,
      icon: <Zap className="h-4 w-4" />,
      category: 'habits'
    },
    {
      id: 'weekly-reports',
      name: 'Weekly Reports',
      description: 'Get a summary of your weekly progress',
      enabled: false,
      icon: <Clock className="h-4 w-4" />,
      category: 'system',
      frequency: 'weekly'
    },
    {
      id: 'challenge-updates',
      name: 'Challenge Updates',
      description: 'Stay updated on community challenges',
      enabled: true,
      icon: <Bell className="h-4 w-4" />,
      category: 'reminders'
    },
    {
      id: 'motivational-messages',
      name: 'Motivational Messages',
      description: 'Receive encouraging messages to stay motivated',
      enabled: false,
      icon: <Sun className="h-4 w-4" />,
      category: 'system'
    }
  ]);

  const [schedules, setSchedules] = useState<NotificationSchedule[]>([
    {
      id: 'morning',
      name: 'Morning Routine',
      time: '08:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      enabled: true
    },
    {
      id: 'evening',
      name: 'Evening Check-in',
      time: '20:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      enabled: true
    },
    {
      id: 'weekend',
      name: 'Weekend Motivation',
      time: '10:00',
      days: ['Saturday', 'Sunday'],
      enabled: false
    }
  ]);

  const [quietHours, setQuietHours] = useState({
    enabled: true,
    start: '22:00',
    end: '08:00'
  });

  const [notificationStats, setNotificationStats] = useState({
    totalSent: 156,
    totalRead: 142,
    responseRate: 91,
    averageResponseTime: '2.3 minutes'
  });

  // Load settings from DataService (localStorage + Supabase)
  useEffect(() => {
    const loadSettings = async () => {
      if (user?.id) {
        try {
          // Load notification settings
          const savedSettings = await DataService.loadNotificationSettings(user.id);
          if (savedSettings) {
            // Re-add icons to the loaded settings
            const settingsWithIcons = savedSettings.map((setting: any) => ({
              ...setting,
              icon: getNotificationIcon(setting.id)
            }));
            setNotificationSettings(settingsWithIcons);
          }

          // Load schedules
          const savedSchedules = await DataService.loadNotificationSchedules(user.id);
          if (savedSchedules) {
            setSchedules(savedSchedules);
          }

          // Load quiet hours
          const savedQuietHours = await DataService.loadQuietHours(user.id);
          if (savedQuietHours) {
            setQuietHours(savedQuietHours);
          }
        } catch (error) {
          console.error('Error loading notification data:', error);
        }
      }
    };

    loadSettings();
  }, [user?.id]);

  // Save settings to DataService (localStorage + Supabase)
  useEffect(() => {
    const saveSettings = async () => {
      if (user?.id) {
        try {
          // Save notification settings
          await DataService.saveNotificationSettings(user.id, notificationSettings);
          
          // Save schedules
          await DataService.saveNotificationSchedules(user.id, schedules);
          
          // Save quiet hours
          await DataService.saveQuietHours(user.id, quietHours);
        } catch (error) {
          console.error('Error saving notification data:', error);
        }
      }
    };

    // Debounce the save operation
    const timeoutId = setTimeout(saveSettings, 1000);
    return () => clearTimeout(timeoutId);
  }, [notificationSettings, schedules, quietHours, user?.id]);

  const toggleNotification = (id: string) => {
    setNotificationSettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const toggleSchedule = (id: string) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === id ? { ...schedule, enabled: !schedule.enabled } : schedule
      )
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'habits': return 'bg-green-100 text-green-800';
      case 'tasks': return 'bg-blue-100 text-blue-800';
      case 'reminders': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'habits': return <CheckCircle className="h-4 w-4" />;
      case 'tasks': return <Calendar className="h-4 w-4" />;
      case 'reminders': return <Bell className="h-4 w-4" />;
      case 'system': return <Settings className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const enabledNotifications = notificationSettings.filter(setting => setting.enabled).length;
  const totalNotifications = notificationSettings.length;

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Basic Notifications</CardTitle>
          <CardDescription>Please sign in to access notification settings</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Basic Notifications</h2>
          <p className="text-slate-600">Manage your notification preferences and schedules</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          <Bell className="h-3 w-3 mr-1" />
          {enabledNotifications}/{totalNotifications} Active
        </Badge>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">{notificationStats.totalSent}</div>
                <p className="text-sm text-slate-600">Notifications Sent</p>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{notificationStats.totalRead}</div>
                <p className="text-sm text-slate-600">Notifications Read</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{notificationStats.responseRate}%</div>
                <p className="text-sm text-slate-600">Response Rate</p>
              </div>
              <Zap className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{notificationStats.averageResponseTime}</div>
                <p className="text-sm text-slate-600">Avg. Response Time</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Choose which notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notificationSettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    {setting.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{setting.name}</h3>
                      <Badge className={getCategoryColor(setting.category)}>
                        {setting.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{setting.description}</p>
                    {setting.time && (
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span className="text-xs text-slate-500">
                          {setting.frequency} at {setting.time}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Switch 
                  checked={setting.enabled} 
                  onCheckedChange={() => toggleNotification(setting.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Schedules */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Schedules</CardTitle>
          <CardDescription>
            Set up custom notification schedules for different times
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{schedule.name}</h3>
                    <p className="text-sm text-slate-600">
                      {schedule.time} • {schedule.days.join(', ')}
                    </p>
                  </div>
                </div>
                <Switch 
                  checked={schedule.enabled} 
                  onCheckedChange={() => toggleSchedule(schedule.id)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Quiet Hours</CardTitle>
          <CardDescription>
            Set times when you don't want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Moon className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Quiet Hours</h3>
                <p className="text-sm text-slate-600">
                  {quietHours.start} - {quietHours.end}
                </p>
              </div>
            </div>
            <Switch 
              checked={quietHours.enabled} 
              onCheckedChange={(checked) => setQuietHours(prev => ({ ...prev, enabled: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              Mobile Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Push notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Vibration alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Sound notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Lock screen display</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-green-600" />
              Desktop Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Browser notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">System tray alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Email notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Desktop popups</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Bell className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Notification Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Enable notifications for better habit tracking consistency</li>
                <li>• Set quiet hours to avoid interruptions during sleep</li>
                <li>• Customize schedules to match your daily routine</li>
                <li>• Use different notification types for different priorities</li>
                <li>• Review notification stats to optimize your experience</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
