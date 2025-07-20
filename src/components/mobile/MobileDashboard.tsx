import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Clock, 
  Award, 
  Zap, 
  Heart, 
  BookOpen, 
  Settings, 
  Share2, 
  Download, 
  Upload, 
  Timer, 
  AlertCircle, 
  CheckSquare, 
  Square,
  Plus,
  BarChart3,
  ListTodo,
  Users,
  Star,
  Trophy,
  Activity,
  Bell,
  Camera,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

export const MobileDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    tasksCompleted: 12,
    tasksToday: 5,
    streakDays: 7,
    productivityScore: 85,
    timeSpent: 320,
    goalsAchieved: 3
  });

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    { icon: Plus, label: 'Add Task', color: 'bg-blue-500', href: '/tasks' },
    { icon: Camera, label: 'Photo Note', color: 'bg-green-500', href: '/notes' },
    { icon: Timer, label: 'Start Timer', color: 'bg-orange-500', href: '/timer' },
    { icon: Calendar, label: 'Schedule', color: 'bg-purple-500', href: '/calendar' }
  ];

  const recentActivities = [
    { type: 'task', action: 'Completed', item: 'Project Review', time: '2 hours ago', icon: CheckSquare },
    { type: 'habit', action: 'Logged', item: 'Morning Exercise', time: '4 hours ago', icon: Heart },
    { type: 'goal', action: 'Achieved', item: 'Weekly Reading Goal', time: '1 day ago', icon: Trophy },
    { type: 'timer', action: 'Started', item: 'Work Session', time: '3 hours ago', icon: Timer }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">
              {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Good morning, {user?.name || 'User'}!</h2>
                <p className="text-sm opacity-90">Ready to boost your productivity?</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{stats.productivityScore}%</div>
                <div className="text-xs opacity-90">Productivity</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tasks Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.tasksCompleted}</p>
                </div>
                <CheckSquare className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Today's Tasks</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.tasksToday}</p>
                </div>
                <ListTodo className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Streak Days</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.streakDays}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Time Spent</p>
                  <p className="text-2xl font-bold text-purple-600">{Math.floor(stats.timeSpent / 60)}h</p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                className={`${action.color} text-white h-16 flex-col space-y-1`}
                variant="ghost"
              >
                <action.icon className="h-5 w-5" />
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Today's Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Daily Goal</span>
                <span>{stats.tasksCompleted}/8 tasks</span>
              </div>
              <Progress value={(stats.tasksCompleted / 8) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Productivity</span>
                <span>{stats.productivityScore}%</span>
              </div>
              <Progress value={stats.productivityScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <activity.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action} {activity.item}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-xs text-gray-600">7-Day Streak</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckSquare className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-xs text-gray-600">Task Master</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-xs text-gray-600">Time Tracker</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 