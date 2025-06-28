import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Pi, 
  Play, 
  TrendingUp, 
  Calendar, 
  Target, 
  Sparkles,
  Clock,
  CheckCircle,
  ExternalLink,
  Eye,
  Users
} from 'lucide-react';

interface AdHistory {
  id: string;
  date: string;
  adTitle: string;
  duration: number;
  type: string;
}

export const PiRewardTracker: React.FC = () => {
  const [totalAds, setTotalAds] = useState(0);
  const [todayAds, setTodayAds] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(5); // 5 ads per week goal
  const [adHistory, setAdHistory] = useState<AdHistory[]>([
    {
      id: '1',
      date: '2024-01-15',
      adTitle: 'Pi Network - Build Your Future',
      duration: 30,
      type: 'video'
    },
    {
      id: '2',
      date: '2024-01-14',
      adTitle: 'Pi Browser - Your Gateway to Web3',
      duration: 15,
      type: 'banner'
    },
    {
      id: '3',
      date: '2024-01-13',
      adTitle: 'Pi Apps - Discover Amazing Apps',
      duration: 20,
      type: 'interactive'
    },
    {
      id: '4',
      date: '2024-01-12',
      adTitle: 'Pi KYC - Verify Your Identity',
      duration: 25,
      type: 'video'
    },
    {
      id: '5',
      date: '2024-01-11',
      adTitle: 'Pi Node - Run a Node, Earn Rewards',
      duration: 18,
      type: 'banner'
    }
  ]);

  useEffect(() => {
    // Calculate total ads watched
    setTotalAds(adHistory.length);

    // Calculate today's ads
    const today = new Date().toISOString().split('T')[0];
    const todayTotal = adHistory.filter(ad => ad.date === today).length;
    setTodayAds(todayTotal);
  }, [adHistory]);

  const weeklyProgress = (totalAds / weeklyGoal) * 100;
  const weeklyAds = adHistory.filter(ad => {
    const adDate = new Date(ad.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return adDate >= weekAgo;
  }).length;

  const totalWatchTime = adHistory.reduce((sum, ad) => sum + ad.duration, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pi Network Integration</h2>
          <p className="text-gray-600">Track your Pi Network ad engagement and ecosystem participation</p>
        </div>
        <Badge className="bg-yellow-100 text-yellow-800">
          <Pi className="h-4 w-4 mr-1" />
          Pi Network
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Ads Watched */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-500" />
              Ads Watched
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {totalAds}
            </div>
            <p className="text-sm text-gray-600">Total Pi Network ads</p>
          </CardContent>
        </Card>

        {/* Today's Ads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Today's Ads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {todayAds}
            </div>
            <p className="text-sm text-gray-600">Ads watched today</p>
          </CardContent>
        </Card>

        {/* Weekly Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Weekly Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {weeklyAds} / {weeklyGoal}
            </div>
            <Progress value={Math.min(weeklyProgress, 100)} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              {Math.round(weeklyProgress)}% of weekly goal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            Engagement Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{totalWatchTime}</div>
              <p className="text-sm text-gray-600">Total Watch Time (sec)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalAds > 0 ? Math.round(totalWatchTime / totalAds) : 0}
              </div>
              <p className="text-sm text-gray-600">Avg. Duration (sec)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {adHistory.filter(ad => ad.type === 'video').length}
              </div>
              <p className="text-sm text-gray-600">Video Ads</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {adHistory.filter(ad => ad.date === new Date().toISOString().split('T')[0]).length}
              </div>
              <p className="text-sm text-gray-600">Today's Engagement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pi Network Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Pi Network Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">By Watching Pi Ads:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Support the Pi Network ecosystem</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Access free habit tracker</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Learn about Pi Network features</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Stay updated with Pi developments</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Pi Network Features:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Pi className="h-4 w-4 text-yellow-500" />
                  <span>Mine Pi on your phone</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Pi className="h-4 w-4 text-yellow-500" />
                  <span>Pi Browser for Web3</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Pi className="h-4 w-4 text-yellow-500" />
                  <span>Pi Apps ecosystem</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Pi className="h-4 w-4 text-yellow-500" />
                  <span>Pi Node for network security</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Ad History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            Recent Ad History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {adHistory.slice(0, 5).map((ad) => (
              <div key={ad.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Play className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{ad.adTitle}</p>
                    <p className="text-sm text-gray-500">{ad.date} • {ad.duration}s</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {ad.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Join the Pi Network Community
            </h3>
            <p className="text-gray-600 mb-4">
              Become a Pi pioneer and be part of the future of digital currency
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => window.open('https://minepi.com/Wain2020', '_blank')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Pi Network
              </Button>
              <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-50">
                <Users className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 