import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Calendar,
  Clock,
  Target,
  Award,
  Users,
  Trophy,
  Star,
  Heart,
  Zap,
  Brain,
  Lightbulb,
  Download,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

interface AnalyticsData {
  productivityScore: number;
  moodTrend: number;
  habitCompletion: number;
  goalProgress: number;
  timeSpent: number;
  streakDays: number;
  peerComparison: number;
  weeklyGrowth: number;
}

interface ChartData {
  date: string;
  value: number;
  category: string;
}

interface PredictiveData {
  nextWeekForecast: number;
  successProbability: number;
  riskFactors: string[];
  recommendations: string[];
  optimalTimeSlots: string[];
}

export const AdvancedAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    productivityScore: 82,
    moodTrend: 75,
    habitCompletion: 68,
    goalProgress: 45,
    timeSpent: 6.5,
    streakDays: 12,
    peerComparison: 78,
    weeklyGrowth: 15
  });

  const [predictiveData, setPredictiveData] = useState<PredictiveData>({
    nextWeekForecast: 85,
    successProbability: 72,
    riskFactors: ['Inconsistent sleep schedule', 'High stress levels', 'Lack of exercise'],
    recommendations: [
      'Maintain consistent 8-hour sleep schedule',
      'Practice daily meditation for stress reduction',
      'Include 30-minute exercise in morning routine',
      'Set specific, measurable goals'
    ],
    optimalTimeSlots: ['9:00 AM - 11:00 AM', '2:00 PM - 4:00 PM', '7:00 PM - 9:00 PM']
  });

  const [timeRange, setTimeRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('productivity');
  const [showPredictions, setShowPredictions] = useState(true);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalyticsData(prev => ({
        ...prev,
        productivityScore: Math.max(0, Math.min(100, prev.productivityScore + (Math.random() - 0.5) * 2)),
        moodTrend: Math.max(0, Math.min(100, prev.moodTrend + (Math.random() - 0.5) * 3)),
        habitCompletion: Math.max(0, Math.min(100, prev.habitCompletion + (Math.random() - 0.5) * 1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generateChartData = (metric: string, range: string) => {
    const data: ChartData[] = [];
    const days = range === 'week' ? 7 : range === 'month' ? 30 : 90;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString(),
        value: Math.floor(Math.random() * 40) + 60, // 60-100 range
        category: metric
      });
    }
    
    return data;
  };

  const exportData = () => {
    const data = {
      analytics: analyticsData,
      predictions: predictiveData,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getMetricColor = (metric: string) => {
    const colors = {
      productivity: 'text-blue-600',
      mood: 'text-green-600',
      habits: 'text-purple-600',
      goals: 'text-orange-600'
    };
    return colors[metric as keyof typeof colors] || 'text-gray-600';
  };

  const getMetricIcon = (metric: string) => {
    const icons = {
      productivity: <BarChart3 className="h-4 w-4" />,
      mood: <Heart className="h-4 w-4" />,
      habits: <Target className="h-4 w-4" />,
      goals: <Star className="h-4 w-4" />
    };
    return icons[metric as keyof typeof icons] || <Activity className="h-4 w-4" />;
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive insights and predictive analytics for your productivity journey</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" onClick={() => setShowPredictions(!showPredictions)}>
            {showPredictions ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPredictions ? 'Hide' : 'Show'} Predictions
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Time Range:</span>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="quarter">Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Metric:</span>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="productivity">Productivity</SelectItem>
                  <SelectItem value="mood">Mood</SelectItem>
                  <SelectItem value="habits">Habits</SelectItem>
                  <SelectItem value="goals">Goals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analyticsData.productivityScore}%</div>
            <p className="text-xs text-muted-foreground">
              +{analyticsData.weeklyGrowth}% from last week
            </p>
            <Progress value={analyticsData.productivityScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mood Trend</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analyticsData.moodTrend}%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
            <Progress value={analyticsData.moodTrend} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Habit Completion</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{analyticsData.habitCompletion}%</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.streakDays} day streak
            </p>
            <Progress value={analyticsData.habitCompletion} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
            <Star className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{analyticsData.goalProgress}%</div>
            <p className="text-xs text-muted-foreground">
              {analyticsData.timeSpent}h today
            </p>
            <Progress value={analyticsData.goalProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts and Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Productivity Trends
            </CardTitle>
            <CardDescription>Your productivity patterns over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between space-x-2">
              {generateChartData(selectedMetric, timeRange).map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div 
                    className="w-8 bg-blue-500 rounded-t"
                    style={{ height: `${data.value}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 rotate-45">
                    {data.date.split('/')[1]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-600">
                {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} over the last {timeRange}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Peer Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              Peer Comparison
            </CardTitle>
            <CardDescription>How you compare to other users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Your Score</span>
                <span className="text-sm font-medium">{analyticsData.productivityScore}%</span>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Top 10%</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <span className="text-sm">95%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Top 25%</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Average</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <span className="text-sm">70%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">You</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${analyticsData.productivityScore}%` }}></div>
                </div>
                <span className="text-sm">{analyticsData.productivityScore}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics */}
      {showPredictions && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Predictive Insights
              </CardTitle>
              <CardDescription>AI-powered future predictions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{predictiveData.nextWeekForecast}%</div>
                  <div className="text-sm text-gray-600">Next Week Forecast</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{predictiveData.successProbability}%</div>
                  <div className="text-sm text-gray-600">Success Probability</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Risk Factors</h4>
                <div className="space-y-1">
                  {predictiveData.riskFactors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {factor}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                AI Recommendations
              </CardTitle>
              <CardDescription>Personalized suggestions for improvement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {predictiveData.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span className="text-yellow-700 text-sm">{rec}</span>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-2">Optimal Time Slots</h4>
                <div className="space-y-1">
                  {predictiveData.optimalTimeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-3 w-3" />
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-500" />
              Activity Breakdown
            </CardTitle>
            <CardDescription>How you spend your time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Deep Work</span>
                <span className="text-sm font-medium">45%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Meetings</span>
                <span className="text-sm font-medium">25%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Breaks</span>
                <span className="text-sm font-medium">20%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
            </div>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Other</span>
                <span className="text-sm font-medium">10%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-gray-500 h-2 rounded-full" style={{ width: '10%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Achievements
            </CardTitle>
            <CardDescription>Your recent accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <div>
                  <div className="text-sm font-medium">7-Day Streak</div>
                  <div className="text-xs text-gray-500">Completed all daily habits</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                <Star className="h-4 w-4 text-green-600" />
                <div>
                  <div className="text-sm font-medium">Productivity Master</div>
                  <div className="text-xs text-gray-500">Achieved 90%+ productivity</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                <Zap className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="text-sm font-medium">Goal Crusher</div>
                  <div className="text-xs text-gray-500">Completed 3 major goals</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-500" />
              Weekly Summary
            </CardTitle>
            <CardDescription>This week's performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Hours Worked</span>
                <span className="text-sm font-medium">32.5h</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Tasks Completed</span>
                <span className="text-sm font-medium">24</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Habits Tracked</span>
                <span className="text-sm font-medium">7/7</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Goals Progress</span>
                <span className="text-sm font-medium">+15%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Mood Average</span>
                <span className="text-sm font-medium">4.2/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 
