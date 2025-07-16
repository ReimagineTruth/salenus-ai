import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { Lock, ArrowUp, TrendingUp, TrendingDown, BarChart3, PieChart, LineChart, Activity, Target, Calendar, Users, Award } from 'lucide-react';

export const AdvancedAnalytics: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('habits');

  if (!user) return null;
  if (!hasFeature('advanced_analytics')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Advanced Analytics</h3>
          <p className="text-slate-500 mb-4">Deep insights with trend analysis, correlation tracking, and predictive suggestions.</p>
          <Button onClick={onUpgrade} className="bg-purple-600 hover:bg-purple-700">
            <ArrowUp className="h-4 w-4 mr-2" />Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    );
  }

  const mockData = {
    habits: {
      completion: 87,
      streak: 12,
      trend: 'up',
      change: '+5.2%'
    },
    tasks: {
      completion: 92,
      productivity: 8.5,
      trend: 'up',
      change: '+3.1%'
    },
    mood: {
      average: 7.8,
      trend: 'up',
      change: '+2.4%'
    },
    goals: {
      progress: 65,
      completed: 3,
      total: 5,
      trend: 'up',
      change: '+12.3%'
    }
  };

  const insights = [
    {
      title: "Peak Productivity Time",
      description: "You're most productive between 9-11 AM",
      icon: <Activity className="h-4 w-4" />,
      type: "positive"
    },
    {
      title: "Habit Consistency",
      description: "Your morning routine has 95% consistency",
      icon: <Target className="h-4 w-4" />,
      type: "positive"
    },
    {
      title: "Mood Correlation",
      description: "Exercise days show 23% better mood scores",
      icon: <TrendingUp className="h-4 w-4" />,
      type: "insight"
    },
    {
      title: "Goal Progress",
      description: "You're ahead of schedule on 2 goals",
      icon: <Award className="h-4 w-4" />,
      type: "positive"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Advanced Analytics</h2>
          <p className="text-slate-600">Deep insights with trend analysis, correlation tracking, and predictive suggestions.</p>
        </div>
        <Badge className="bg-purple-100 text-purple-700">Premium</Badge>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Time Period</h3>
            <div className="flex space-x-2">
              {['week', 'month', 'quarter', 'year'].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className="capitalize"
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Habit Completion</p>
                <p className="text-2xl font-bold text-slate-900">{mockData.habits.completion}%</p>
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{mockData.habits.change}</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Task Productivity</p>
                <p className="text-2xl font-bold text-slate-900">{mockData.tasks.productivity}/10</p>
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{mockData.tasks.change}</span>
                </div>
              </div>
              <PieChart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Average Mood</p>
                <p className="text-2xl font-bold text-slate-900">{mockData.mood.average}/10</p>
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{mockData.mood.change}</span>
                </div>
              </div>
              <LineChart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Goal Progress</p>
                <p className="text-2xl font-bold text-slate-900">{mockData.goals.progress}%</p>
                <div className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">{mockData.goals.change}</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Habit Performance</CardTitle>
                <CardDescription>Your habit completion rates over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Morning Routine</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={95} className="w-20" />
                      <span className="text-sm font-medium">95%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Exercise</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={78} className="w-20" />
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Reading</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={82} className="w-20" />
                      <span className="text-sm font-medium">82%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Productivity Insights</CardTitle>
                <CardDescription>Key productivity metrics and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Peak Hours</p>
                      <p className="text-sm text-slate-600">9 AM - 11 AM</p>
                    </div>
                    <Activity className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">Focus Sessions</p>
                      <p className="text-sm text-slate-600">4.2 hours/day</p>
                    </div>
                    <Target className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium">Task Completion</p>
                      <p className="text-sm text-slate-600">92% success rate</p>
                    </div>
                    <Award className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
              <CardDescription>Performance trends over the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-900">Habit Consistency</h4>
                    <p className="text-2xl font-bold text-blue-700">+15%</p>
                    <p className="text-sm text-blue-600">vs last period</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-900">Productivity</h4>
                    <p className="text-2xl font-bold text-green-700">+8%</p>
                    <p className="text-sm text-green-600">vs last period</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-purple-900">Goal Progress</h4>
                    <p className="text-2xl font-bold text-purple-700">+23%</p>
                    <p className="text-sm text-purple-600">vs last period</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Correlation Insights</CardTitle>
              <CardDescription>Discover patterns and relationships in your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'positive' ? 'bg-green-100 text-green-600' :
                      insight.type === 'insight' ? 'bg-blue-100 text-blue-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {insight.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{insight.title}</h4>
                      <p className="text-sm text-slate-600">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Predictions</CardTitle>
              <CardDescription>Predictive insights based on your patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">📈 Success Prediction</h4>
                  <p className="text-sm text-purple-700">Based on your current momentum, you're likely to achieve 3 of your 5 goals this quarter.</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">🎯 Optimal Schedule</h4>
                  <p className="text-sm text-green-700">Your peak productivity window is 9-11 AM. Schedule important tasks during this time.</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">⚠️ Potential Risk</h4>
                  <p className="text-sm text-orange-700">Your exercise habit shows a slight decline. Consider adjusting your routine to maintain consistency.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 