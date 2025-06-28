import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  Check,
  TrendingUp,
  Target,
  Activity,
  Zap,
  Brain,
  Award,
  Clock,
  CheckCircle,
  Lock
} from 'lucide-react';

interface DemoDashboardProps {
  plan: 'Basic' | 'Pro' | 'Premium';
  onUpgrade?: () => void;
}

const planColors = {
  Basic: 'bg-blue-600',
  Pro: 'bg-indigo-600',
  Premium: 'bg-purple-600'
};

const planGradients = {
  Basic: 'from-blue-50 to-indigo-50',
  Pro: 'from-indigo-50 to-purple-50',
  Premium: 'from-purple-50 to-pink-50'
};

export const DemoDashboard: React.FC<DemoDashboardProps> = ({ plan, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderBasicDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, Alex!</h2>
          <p className="text-gray-600">Here's your progress for today</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">Basic Plan</Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">Habits</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">5/5</div>
            <p className="text-xs text-gray-500">Daily goal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <ClipboardList className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Tasks</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">12/20</div>
            <p className="text-xs text-gray-500">Completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-600" />
              <span className="text-sm text-gray-600">Streak</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">7</div>
            <p className="text-xs text-gray-500">Days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-600">Challenges</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">3</div>
            <p className="text-xs text-gray-500">Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Habit Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Today's Habits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Morning Exercise</span>
            </div>
            <Badge className="bg-green-100 text-green-800">Completed</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium">Read 30 minutes</span>
            </div>
            <Badge className="bg-green-100 text-green-800">Completed</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Drink 8 glasses water</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">6/8</span>
              <Progress value={75} className="w-20" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="font-medium text-gray-500">Meditation</span>
            </div>
            <Badge variant="outline" className="text-gray-500">Pending</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="font-medium text-gray-500">No social media</span>
            </div>
            <Badge variant="outline" className="text-gray-500">Pending</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Task Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Today's Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3 p-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Review project proposal</span>
            </div>
            <div className="flex items-center space-x-3 p-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Call client</span>
            </div>
            <div className="flex items-center space-x-3 p-2">
              <div className="h-4 w-4 border-2 border-gray-300 rounded" />
              <span className="text-sm">Prepare presentation</span>
            </div>
            <div className="flex items-center space-x-3 p-2">
              <div className="h-4 w-4 border-2 border-gray-300 rounded" />
              <span className="text-sm">Update website</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Challenges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">30-Day Fitness Challenge</span>
                <Badge className="bg-purple-100 text-purple-800 text-xs">Day 7</Badge>
              </div>
              <Progress value={23} className="h-2" />
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Reading Challenge</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">Day 5</Badge>
              </div>
              <Progress value={17} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade Prompt */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <Sparkles className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlock Pro Features</h3>
            <p className="text-gray-600 mb-4">Get mood tracking, advanced analytics, and AI coaching</p>
            <Button onClick={onUpgrade} className="bg-indigo-600 hover:bg-indigo-700">
              Upgrade to Pro
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, Alex!</h2>
          <p className="text-gray-600">Your AI-powered productivity hub</p>
        </div>
        <Badge className="bg-indigo-100 text-indigo-800">Pro Plan</Badge>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">Habits</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">8/10</div>
            <p className="text-xs text-gray-500">Daily goal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <span className="text-sm text-gray-600">Mood</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">4.2/5</div>
            <p className="text-xs text-gray-500">Today's score</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Productivity</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">87%</div>
            <p className="text-xs text-gray-500">This week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-600">Goals</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">5</div>
            <p className="text-xs text-gray-500">Active</p>
          </CardContent>
        </Card>
      </div>

      {/* Mood Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Mood & Energy Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Today's Mood</h4>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">😔 😐 🙂 😄</span>
                <span className="text-sm font-medium">😄 Good</span>
              </div>
              <Progress value={80} className="h-3" />
            </div>
            <div>
              <h4 className="font-medium mb-3">Energy Level</h4>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">⚡ ⚡ ⚡ ⚡ ⚡</span>
                <span className="text-sm font-medium">⚡⚡⚡⚡ High</span>
              </div>
              <Progress value={80} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Advanced Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Learn Spanish</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">Milestone 3</Badge>
              </div>
              <Progress value={60} className="h-2" />
              <p className="text-xs text-gray-600 mt-1">Complete 50 lessons</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Habit Journal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">"Today's workout was amazing! Felt energized throughout the day. Need to focus more on meditation tomorrow."</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Today's Entry</span>
                <span>2 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Custom Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Team Fitness Challenge</span>
                <Badge className="bg-purple-100 text-purple-800 text-xs">3 members</Badge>
              </div>
              <Progress value={45} className="h-2" />
              <p className="text-xs text-gray-600 mt-1">Week 2 of 4</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg">
              <h4 className="font-medium text-sm mb-2">Productivity Pattern</h4>
              <p className="text-xs text-gray-600">You're most productive between 9-11 AM. Schedule important tasks during this window.</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <h4 className="font-medium text-sm mb-2">Mood Correlation</h4>
              <p className="text-xs text-gray-600">Your mood improves by 23% on days when you exercise. Consider morning workouts.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade to Premium */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlock Premium Features</h3>
            <p className="text-gray-600 mb-4">Get AI personal coaching, advanced analytics, and VIP support</p>
            <Button onClick={onUpgrade} className="bg-purple-600 hover:bg-purple-700">
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPremiumDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, Alex!</h2>
          <p className="text-gray-600">Your AI-powered life optimization center</p>
        </div>
        <Badge className="bg-purple-100 text-purple-800">Premium Plan</Badge>
      </div>

      {/* Premium Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-600">AI Score</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">94%</div>
            <p className="text-xs text-gray-500">Optimization</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span className="text-sm text-gray-600">Achievements</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">23</div>
            <p className="text-xs text-gray-500">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-gray-600">Coaching</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className="text-xs text-gray-500">Sessions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600">Growth</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">+156%</div>
            <p className="text-xs text-gray-500">This quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Coach Session */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Personal Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Today's Session</h4>
              <div className="p-4 bg-white rounded-lg">
                <p className="text-sm text-gray-700 mb-3">"Based on your recent patterns, I recommend focusing on deep work sessions in the morning. Your productivity peaks between 9-11 AM."</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>AI Coach</span>
                  <span>2 min ago</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Action Items</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Schedule deep work 9-11 AM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Reduce social media usage</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-2 border-gray-300 rounded" />
                  <span className="text-sm">Practice meditation daily</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Advanced Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Productivity Trends</h4>
              <div className="text-2xl font-bold text-blue-600 mb-1">+23%</div>
              <p className="text-xs text-gray-600">vs last month</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Goal Completion</h4>
              <div className="text-2xl font-bold text-green-600 mb-1">87%</div>
              <p className="text-xs text-gray-600">this week</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">AI Optimization</h4>
              <div className="text-2xl font-bold text-purple-600 mb-1">94%</div>
              <p className="text-xs text-gray-600">efficiency score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendar Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Today's Schedule</span>
                <Badge className="bg-indigo-100 text-indigo-800">Synced</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>9:00 AM - Deep Work Session</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>11:00 AM - Team Meeting</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>2:00 PM - AI Coaching Session</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              VIP Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium">Dedicated Support</span>
                <Badge className="bg-yellow-100 text-yellow-800">24/7</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Priority response time</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Dedicated account manager</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Phone support available</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exclusive Features */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Exclusive Premium Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg">
              <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-sm mb-1">API Access</h4>
              <p className="text-xs text-gray-600">Integrate with your tools</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <GraduationCap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-sm mb-1">AI Courses</h4>
              <p className="text-xs text-gray-600">Personalized learning paths</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-sm mb-1">White Label</h4>
              <p className="text-xs text-gray-600">Custom branding</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className={`bg-gradient-to-br ${planGradients[plan]} min-h-screen`}>
      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'features'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Features
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'overview' && (
            <>
              {plan === 'Basic' && renderBasicDashboard()}
              {plan === 'Pro' && renderProDashboard()}
              {plan === 'Premium' && renderPremiumDashboard()}
            </>
          )}

          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan} Plan Features
                </h2>
                <p className="text-gray-600">
                  Everything you need to optimize your life and achieve your goals
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plan === 'Basic' && (
                  <>
                    <FeatureCard
                      icon={<BarChart3 className="h-6 w-6" />}
                      title="Basic Habit Tracking"
                      description="Track up to 5 daily habits with simple streak counters"
                      available={true}
                    />
                    <FeatureCard
                      icon={<ClipboardList className="h-6 w-6" />}
                      title="Task Management"
                      description="Create and manage up to 20 tasks with due dates"
                      available={true}
                    />
                    <FeatureCard
                      icon={<Users className="h-6 w-6" />}
                      title="Community Challenges"
                      description="Join public community challenges and leaderboards"
                      available={true}
                    />
                    <FeatureCard
                      icon={<Cloud className="h-6 w-6" />}
                      title="Cross-Platform Sync"
                      description="Sync your data across all your devices"
                      available={true}
                    />
                    <FeatureCard
                      icon={<Smartphone className="h-6 w-6" />}
                      title="Mobile App Access"
                      description="Access on iOS and Android with offline functionality"
                      available={true}
                    />
                    <FeatureCard
                      icon={<Bell className="h-6 w-6" />}
                      title="Basic Notifications"
                      description="Simple push notifications for reminders"
                      available={true}
                    />
                  </>
                )}

                {plan === 'Pro' && (
                  <>
                    <FeatureCard
                      icon={<BarChart3 className="h-6 w-6" />}
                      title="Advanced Habit Tracking"
                      description="Unlimited habits with detailed analytics"
                      available={true}
                    />
                    <FeatureCard
                      icon={<Heart className="h-6 w-6" />}
                      title="Mood Tracking"
                      description="Track daily mood and get personalized insights"
                      available={true}
                    />
                    <FeatureCard
                      icon={<Star className="h-6 w-6" />}
                      title="Advanced Goals"
                      description="Set complex goals with milestones and tracking"
                      available={true}
                    />
                    <FeatureCard
                      icon={<BookOpen className="h-6 w-6" />}
                      title="Habit Journal"
                      description="Advanced journaling with templates and tags"
                      available={true}
                    />
                    <FeatureCard
                      icon={<Trophy className="h-6 w-6" />}
                      title="Custom Challenges"
                      description="Create private challenges for friends"
                      available={true}
                    />
                    <FeatureCard
                      icon={<Flame className="h-6 w-6" />}
                      title="Streak Protection"
                      description="Protect your streaks with freeze days"
                      available={true}
                    />
                    <FeatureCard
                      icon={<Bell className="h-6 w-6" />}
                      title="Smart Reminders"
                      description="AI-powered adaptive reminders"
                      available={true}
                    />
                    <FeatureCard
                      icon={<MessageSquare className="h-6 w-6" />}
                      title="Priority Support"
                      description="Email support with 24-hour response"
                      available={true}
                    />
                  </>
                )}

                {plan === 'Premium' && (
                  <>
                    <FeatureCard
                      icon={<Brain className="h-6 w-6" />}
                      title="AI Personal Coach"
                      description="Personalized AI coaching sessions and analysis"
                      available={true}
                    />
                    <FeatureCard
                      icon={<PieChart className="h-6 w-6" />}
                      title="Advanced Analytics"
                      description="Deep insights with trend analysis and predictions"
                      available={true}
                    />
                    <FeatureCard
                      icon={<Calendar className="h-6 w-6" />}
                      title="Calendar Integration"
                      description="Full integration with Google, Outlook, and Apple Calendar"
                      available={true}
                    />
                    <FeatureCard
                      icon={<Shield className="h-6 w-6" />}
                      title="VIP Support"
                      description="24/7 priority support with dedicated manager"
                      available={true}
                    />
                    <FeatureCard
                      icon={<Lightbulb className="h-6 w-6" />}
                      title="Exclusive Features"
                      description="Early access to beta features and workshops"
                      available={true}
                    />
                    <FeatureCard
                      icon={<GraduationCap className="h-6 w-6" />}
                      title="Personalized Courses"
                      description="AI-curated learning paths and skill development"
                      available={true}
                    />
                    <FeatureCard
                      icon={<Globe className="h-6 w-6" />}
                      title="API Access"
                      description="Developer API access for integrations"
                      available={true}
                    />
                    <FeatureCard
                      icon={<Settings className="h-6 w-6" />}
                      title="White-Label Options"
                      description="Custom branding and white-label solutions"
                      available={true}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  available: boolean;
}> = ({ icon, title, description, available }) => (
  <Card className={`transition-all duration-300 hover:shadow-lg ${
    available ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
  }`}>
    <CardContent className="pt-6">
      <div className="flex items-center space-x-3 mb-3">
        <div className={`p-2 rounded-lg ${
          available ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      {available && (
        <div className="flex items-center space-x-1">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-600 font-medium">Available</span>
        </div>
      )}
    </CardContent>
  </Card>
); 