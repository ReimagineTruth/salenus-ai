import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { Key, Clock, Flame, Shield, RefreshCw, TrendingUp, ArrowUp, Zap, AlertTriangle } from 'lucide-react';

export const StreakProtection: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  const [streaks, setStreaks] = useState([
    {
      id: 1,
      habit: 'Morning Exercise',
      currentStreak: 45,
      longestStreak: 67,
      protectionUsed: 2,
      protectionAvailable: 3,
      lastUsed: '2024-01-10',
      status: 'active'
    },
    {
      id: 2,
      habit: 'Reading',
      currentStreak: 23,
      longestStreak: 45,
      protectionUsed: 1,
      protectionAvailable: 2,
      lastUsed: '2024-01-08',
      status: 'active'
    },
    {
      id: 3,
      habit: 'Meditation',
      currentStreak: 12,
      longestStreak: 30,
      protectionUsed: 0,
      protectionAvailable: 1,
      lastUsed: null,
      status: 'active'
    }
  ]);
  const [showProtectionModal, setShowProtectionModal] = useState(false);
  const [selectedStreak, setSelectedStreak] = useState<number | null>(null);

  if (!user) return null;
  if (!hasFeature('streak_protection')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Streak Protection</h3>
          <p className="text-slate-500 mb-4">Protect your streaks with recovery options and grace periods.</p>
          <Button onClick={onUpgrade} className="bg-indigo-600 hover:bg-indigo-700">
            <ArrowUp className="h-4 w-4 mr-2" />Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    );
  }

  const useProtection = (streakId: number) => {
    setStreaks(streaks.map(streak => 
      streak.id === streakId 
        ? { 
            ...streak, 
            protectionUsed: streak.protectionUsed + 1,
            protectionAvailable: streak.protectionAvailable - 1,
            lastUsed: new Date().toISOString().split('T')[0]
          }
        : streak
    ));
    setShowProtectionModal(false);
    setSelectedStreak(null);
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 50) return 'text-red-600';
    if (streak >= 30) return 'text-orange-600';
    if (streak >= 15) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProtectionStatus = (available: number) => {
    if (available === 0) return 'bg-red-100 text-red-700';
    if (available === 1) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Streak Protection</h2>
          <p className="text-slate-600">Protect your streaks with recovery options and grace periods.</p>
        </div>
        <Badge className="bg-indigo-100 text-indigo-700">Pro</Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Streaks</p>
                <p className="text-2xl font-bold text-slate-900">{streaks.length}</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Protection</p>
                <p className="text-2xl font-bold text-slate-900">{streaks.reduce((sum, s) => sum + s.protectionAvailable, 0)}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Used Protection</p>
                <p className="text-2xl font-bold text-slate-900">{streaks.reduce((sum, s) => sum + s.protectionUsed, 0)}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Streak</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round(streaks.reduce((sum, s) => sum + s.currentStreak, 0) / streaks.length)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streaks List */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Streaks</TabsTrigger>
          <TabsTrigger value="protection">Protection Status</TabsTrigger>
          <TabsTrigger value="stats">Streak Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {streaks.map((streak) => (
              <Card key={streak.id} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Flame className="h-5 w-5 text-orange-600" />
                        <h3 className="text-lg font-semibold">{streak.habit}</h3>
                        <Badge className={getProtectionStatus(streak.protectionAvailable)}>
                          {streak.protectionAvailable} protection{streak.protectionAvailable !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
                        <div className="flex items-center space-x-1">
                          <Flame className="h-4 w-4" />
                          <span className={getStreakColor(streak.currentStreak)}>
                            {streak.currentStreak} days
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>Best: {streak.longestStreak} days</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {streak.protectionAvailable > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedStreak(streak.id);
                            setShowProtectionModal(true);
                          }}
                        >
                          <Shield className="h-4 w-4 mr-1" />
                          Use Protection
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Streak Progress</span>
                        <span className="text-sm text-slate-600">{Math.round((streak.currentStreak / streak.longestStreak) * 100)}%</span>
                      </div>
                      <Progress value={(streak.currentStreak / streak.longestStreak) * 100} className="h-2" />
                    </div>
                    
                    {streak.lastUsed && (
                      <div className="flex items-center space-x-2 text-sm text-slate-500">
                        <Clock className="h-4 w-4" />
                        <span>Last protection used: {new Date(streak.lastUsed).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="protection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Protection Overview</CardTitle>
              <CardDescription>Manage your streak protection options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-green-900">Available Protection</h4>
                    <p className="text-2xl font-bold text-green-700">
                      {streaks.reduce((sum, s) => sum + s.protectionAvailable, 0)}
                    </p>
                    <p className="text-sm text-green-600">total uses</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <RefreshCw className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-blue-900">Used This Month</h4>
                    <p className="text-2xl font-bold text-blue-700">
                      {streaks.reduce((sum, s) => sum + s.protectionUsed, 0)}
                    </p>
                    <p className="text-sm text-blue-600">times</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Zap className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-purple-900">Recovery Rate</h4>
                    <p className="text-2xl font-bold text-purple-700">94%</p>
                    <p className="text-sm text-purple-600">success rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Streak Statistics</CardTitle>
              <CardDescription>Your streak performance and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">🔥 Longest Active Streak</h4>
                  <p className="text-sm text-orange-700">Morning Exercise: 45 days (67 days best)</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">📈 Streak Growth</h4>
                  <p className="text-sm text-green-700">Your average streak length has increased by 15% this month.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">🛡️ Protection Usage</h4>
                  <p className="text-sm text-blue-700">You've used protection 3 times, saving 3 streaks from breaking.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Protection Modal */}
      {showProtectionModal && selectedStreak && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span>Use Streak Protection</span>
              </CardTitle>
              <CardDescription>
                This will protect your streak from breaking today. Are you sure?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">Warning</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Using protection will count as completing your habit for today, but it will use one of your protection tokens.
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => useProtection(selectedStreak)}
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Use Protection
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowProtectionModal(false);
                    setSelectedStreak(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}; 
