import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { Lock, ArrowUp, Trophy, Plus, Users, Calendar, Target, Award, TrendingUp, Clock, Star, Share, Edit, Trash } from 'lucide-react';

export const CustomChallenges: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  const [challenges, setChallenges] = useState([
    {
      id: 1,
      title: '30-Day Fitness Challenge',
      description: 'Complete 30 days of consistent workouts',
      category: 'Fitness',
      duration: 30,
      participants: 45,
      progress: 75,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      rewards: ['Achievement Badge', 'Community Recognition'],
      milestones: [
        { day: 7, description: 'Week 1 Complete', completed: true },
        { day: 14, description: 'Week 2 Complete', completed: true },
        { day: 21, description: 'Week 3 Complete', completed: false },
        { day: 30, description: 'Challenge Complete', completed: false }
      ],
      status: 'active'
    },
    {
      id: 2,
      title: 'Reading Challenge',
      description: 'Read 12 books in 12 months',
      category: 'Learning',
      duration: 365,
      participants: 23,
      progress: 45,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      rewards: ['Knowledge Badge', 'Reading Certificate'],
      milestones: [
        { day: 30, description: '1 Book Complete', completed: true },
        { day: 60, description: '2 Books Complete', completed: true },
        { day: 90, description: '3 Books Complete', completed: false },
        { day: 365, description: '12 Books Complete', completed: false }
      ],
      status: 'active'
    },
    {
      id: 3,
      title: 'Meditation Streak',
      description: 'Meditate for 10 minutes daily for 100 days',
      category: 'Wellness',
      duration: 100,
      participants: 67,
      progress: 60,
      startDate: '2024-01-01',
      endDate: '2024-04-10',
      rewards: ['Mindfulness Badge', 'Peace Certificate'],
      milestones: [
        { day: 7, description: 'Week 1 Complete', completed: true },
        { day: 30, description: 'Month 1 Complete', completed: true },
        { day: 60, description: 'Month 2 Complete', completed: false },
        { day: 100, description: 'Challenge Complete', completed: false }
      ],
      status: 'active'
    }
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    category: '',
    duration: 30,
    rewards: []
  });

  if (!user) return null;
  if (!hasFeature('custom_challenges')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Custom Challenges</h3>
          <p className="text-slate-500 mb-4">Create and participate in custom challenges with rewards and milestones.</p>
          <Button onClick={onUpgrade} className="bg-indigo-600 hover:bg-indigo-700">
            <ArrowUp className="h-4 w-4 mr-2" />Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    );
  }

  const createChallenge = () => {
    if (newChallenge.title && newChallenge.description) {
      const challenge = {
        id: Date.now(),
        ...newChallenge,
        participants: 1,
        progress: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + newChallenge.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        milestones: [],
        status: 'active'
      };
      setChallenges([challenge, ...challenges]);
      setNewChallenge({ title: '', description: '', category: '', duration: 30, rewards: [] });
      setShowCreate(false);
    }
  };

  const categories = ['Fitness', 'Learning', 'Wellness', 'Productivity', 'Social', 'Creative', 'Other'];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Custom Challenges</h2>
          <p className="text-slate-600">Create and participate in custom challenges with rewards and milestones.</p>
        </div>
        <Badge className="bg-indigo-100 text-indigo-700">Pro</Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Challenges</p>
                <p className="text-2xl font-bold text-slate-900">{challenges.filter(c => c.status === 'active').length}</p>
              </div>
              <Trophy className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Participants</p>
                <p className="text-2xl font-bold text-slate-900">{challenges.reduce((sum, c) => sum + c.participants, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Progress</p>
                <p className="text-2xl font-bold text-slate-900">
                  {Math.round(challenges.reduce((sum, c) => sum + c.progress, 0) / challenges.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Rewards Earned</p>
                <p className="text-2xl font-bold text-slate-900">8</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Challenge Button */}
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowCreate(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      {/* Create Challenge Modal */}
      {showCreate && (
        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <CardTitle>Create New Challenge</CardTitle>
            <CardDescription>Design a custom challenge with milestones and rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Challenge Title</label>
                <Input
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                  placeholder="e.g., 30-Day Fitness Challenge"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={newChallenge.category}
                  onChange={(e) => setNewChallenge({...newChallenge, category: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newChallenge.description}
                onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                placeholder="Describe your challenge goals and requirements..."
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Duration (days)</label>
              <Input
                type="number"
                value={newChallenge.duration}
                onChange={(e) => setNewChallenge({...newChallenge, duration: parseInt(e.target.value)})}
                min="1"
                max="365"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Rewards</label>
              <Input
                value={newChallenge.rewards.join(', ')}
                onChange={(e) => setNewChallenge({...newChallenge, rewards: e.target.value.split(', ').filter(r => r)})}
                placeholder="e.g., Achievement Badge, Community Recognition"
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={createChallenge} className="bg-indigo-600 hover:bg-indigo-700">
                Create Challenge
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Challenges List */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {challenges.filter(c => c.status === 'active').map((challenge) => (
              <Card key={challenge.id} className="border-l-4 border-l-indigo-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Trophy className="h-5 w-5 text-indigo-600" />
                        <h3 className="text-lg font-semibold">{challenge.title}</h3>
                        <Badge className={getStatusColor(challenge.status)}>
                          {challenge.status}
                        </Badge>
                      </div>
                      <p className="text-slate-600 mb-3">{challenge.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{challenge.duration} days</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{challenge.participants} participants</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Target className="h-4 w-4" />
                          <span>{challenge.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-slate-600">{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className={`h-2 ${getProgressColor(challenge.progress)}`} />
                  </div>

                  {/* Milestones */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-3">Milestones</h4>
                    <div className="space-y-2">
                      {challenge.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50">
                          {milestone.completed ? (
                            <Award className="h-4 w-4 text-green-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-slate-400" />
                          )}
                          <span className={`text-sm ${milestone.completed ? 'text-green-600' : 'text-slate-600'}`}>
                            Day {milestone.day}: {milestone.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rewards */}
                  {challenge.rewards.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Rewards</h4>
                      <div className="flex flex-wrap gap-2">
                        {challenge.rewards.map((reward, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            {reward}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No Completed Challenges</h3>
            <p className="text-slate-500">Complete your active challenges to see them here!</p>
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Challenges</CardTitle>
              <CardDescription>Join challenges created by other members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold">100-Day Writing Challenge</h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">Write 500 words daily for 100 days</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>156 participants</span>
                      <span>Day 45</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold">No Sugar Challenge</h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">Avoid added sugars for 30 days</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>89 participants</span>
                      <span>Day 12</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trophy className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold">Language Learning Sprint</h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">Practice a new language for 21 days</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>234 participants</span>
                      <span>Day 8</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Challenge Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Challenge Insights</CardTitle>
          <CardDescription>Your performance and achievements across all challenges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900">Completion Rate</h4>
              <p className="text-2xl font-bold text-green-700">85%</p>
              <p className="text-sm text-green-600">of challenges completed</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Award className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900">Rewards Earned</h4>
              <p className="text-2xl font-bold text-blue-700">12</p>
              <p className="text-sm text-blue-600">badges and certificates</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-900">Community Rank</h4>
              <p className="text-2xl font-bold text-purple-700">#23</p>
              <p className="text-sm text-purple-600">out of 1,247 members</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 