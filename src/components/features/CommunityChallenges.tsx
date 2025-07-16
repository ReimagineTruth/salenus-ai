import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Trophy, CheckCircle, XCircle, Calendar, Target, Award, Zap, TrendingUp, Star, Flame, Clock, BookOpen, Heart, BarChart3, List } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Challenge {
  id: string;
  name: string;
  description: string;
  participants: number;
  joined: boolean;
  progress: number;
  target: number;
  duration: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rewards: string[];
  leaderboard: Array<{ name: string; score: number; rank: number }>;
  startDate: Date;
  endDate: Date;
  tags: string[];
}

const mockChallenges: Challenge[] = [
  {
    id: '1',
    name: '7-Day Focus Streak',
    description: 'Stay focused for 7 days in a row and log your progress daily. Build concentration and productivity habits.',
    participants: 124,
    joined: false,
    progress: 0,
    target: 7,
    duration: 7,
    category: 'Productivity',
    difficulty: 'Medium',
    rewards: ['Focus Badge', '50 Pi Points', 'Productivity Certificate'],
    leaderboard: [
      { name: 'Alice', score: 7, rank: 1 },
      { name: 'Bob', score: 6, rank: 2 },
      { name: 'You', score: 3, rank: 8 },
      { name: 'Eve', score: 2, rank: 15 },
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tags: ['focus', 'productivity', 'streak']
  },
  {
    id: '2',
    name: 'Daily Reading Challenge',
    description: 'Read at least 10 pages every day for a week. Expand your knowledge and build a reading habit.',
    participants: 98,
    joined: false,
    progress: 0,
    target: 70,
    duration: 7,
    category: 'Learning',
    difficulty: 'Easy',
    rewards: ['Reader Badge', '30 Pi Points', 'Knowledge Certificate'],
    leaderboard: [
      { name: 'Sam', score: 7, rank: 1 },
      { name: 'You', score: 5, rank: 3 },
      { name: 'Lily', score: 4, rank: 5 },
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tags: ['reading', 'learning', 'knowledge']
  },
  {
    id: '3',
    name: '30-Day Fitness Journey',
    description: 'Complete 30 days of consistent exercise. Transform your health and build lasting fitness habits.',
    participants: 256,
    joined: false,
    progress: 0,
    target: 30,
    duration: 30,
    category: 'Fitness',
    difficulty: 'Hard',
    rewards: ['Fitness Badge', '100 Pi Points', 'Health Certificate', 'Premium Workout Plan'],
    leaderboard: [
      { name: 'Mike', score: 30, rank: 1 },
      { name: 'Sarah', score: 28, rank: 2 },
      { name: 'You', score: 0, rank: 0 },
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    tags: ['fitness', 'health', 'exercise']
  },
  {
    id: '4',
    name: 'Mindfulness Meditation',
    description: 'Practice 10 minutes of meditation daily for 14 days. Cultivate inner peace and mental clarity.',
    participants: 87,
    joined: false,
    progress: 0,
    target: 14,
    duration: 14,
    category: 'Mindfulness',
    difficulty: 'Medium',
    rewards: ['Zen Badge', '40 Pi Points', 'Mindfulness Certificate'],
    leaderboard: [
      { name: 'Emma', score: 14, rank: 1 },
      { name: 'David', score: 12, rank: 2 },
      { name: 'You', score: 0, rank: 0 },
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    tags: ['meditation', 'mindfulness', 'zen']
  },
  {
    id: '5',
    name: 'Water Intake Challenge',
    description: 'Drink 8 glasses of water daily for 21 days. Improve hydration and overall health.',
    participants: 342,
    joined: false,
    progress: 0,
    target: 21,
    duration: 21,
    category: 'Health',
    difficulty: 'Easy',
    rewards: ['Hydration Badge', '25 Pi Points', 'Health Certificate'],
    leaderboard: [
      { name: 'John', score: 21, rank: 1 },
      { name: 'Lisa', score: 20, rank: 2 },
      { name: 'You', score: 0, rank: 0 },
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    tags: ['hydration', 'health', 'water']
  },
  {
    id: '6',
    name: 'Digital Detox Week',
    description: 'Reduce screen time by 50% for 7 days. Reconnect with the real world and improve mental health.',
    participants: 156,
    joined: false,
    progress: 0,
    target: 7,
    duration: 7,
    category: 'Mindfulness',
    difficulty: 'Hard',
    rewards: ['Detox Badge', '75 Pi Points', 'Digital Wellness Certificate'],
    leaderboard: [
      { name: 'Alex', score: 7, rank: 1 },
      { name: 'Maria', score: 6, rank: 2 },
      { name: 'You', score: 0, rank: 0 },
    ],
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tags: ['digital-detox', 'mindfulness', 'wellness']
  }
];

export const CommunityChallenges: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Productivity', 'Learning', 'Fitness', 'Mindfulness', 'Health'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // Load user progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`challengeProgress_${user?.id}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setChallenges(prev => prev.map(challenge => ({
        ...challenge,
        joined: progress[challenge.id]?.joined || false,
        progress: progress[challenge.id]?.progress || 0
      })));
    }
  }, [user?.id]);

  // Save progress to localStorage
  useEffect(() => {
    if (user?.id) {
      const progress = challenges.reduce((acc, challenge) => ({
        ...acc,
        [challenge.id]: {
          joined: challenge.joined,
          progress: challenge.progress
        }
      }), {});
      localStorage.setItem(`challengeProgress_${user?.id}`, JSON.stringify(progress));
    }
  }, [challenges, user?.id]);

  const joinChallenge = (id: string) => {
    setChallenges(challenges.map(c => c.id === id ? { ...c, joined: true } : c));
  };

  const leaveChallenge = (id: string) => {
    setChallenges(challenges.map(c => c.id === id ? { ...c, joined: false, progress: 0 } : c));
  };

  const logProgress = (id: string) => {
    setChallenges(challenges.map(c => {
      if (c.id === id && c.joined && c.progress < c.target) {
        return { ...c, progress: c.progress + 1 };
      }
      return c;
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Productivity': return <Target className="h-4 w-4" />;
      case 'Learning': return <BookOpen className="h-4 w-4" />;
      case 'Fitness': return <Zap className="h-4 w-4" />;
      case 'Mindfulness': return <Award className="h-4 w-4" />;
      case 'Health': return <Heart className="h-4 w-4" />;
      default: return <Trophy className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Productivity': return 'bg-blue-100 text-blue-800';
      case 'Learning': return 'bg-purple-100 text-purple-800';
      case 'Fitness': return 'bg-orange-100 text-orange-800';
      case 'Mindfulness': return 'bg-indigo-100 text-indigo-800';
      case 'Health': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    const categoryMatch = selectedCategory === 'All' || challenge.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'All' || challenge.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const joinedChallenges = challenges.filter(c => c.joined);
  const totalProgress = joinedChallenges.reduce((sum, c) => sum + c.progress, 0);
  const totalTarget = joinedChallenges.reduce((sum, c) => sum + c.target, 0);
  const completionRate = totalTarget > 0 ? Math.round((totalProgress / totalTarget) * 100) : 0;

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Community Challenges</CardTitle>
          <CardDescription>Please sign in to access community challenges</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Community Challenges</h2>
          <p className="text-slate-600">Join challenges, compete with others, and earn rewards</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">{joinedChallenges.length}</div>
                <p className="text-sm text-slate-600">Active Challenges</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{totalProgress}</div>
                <p className="text-sm text-slate-600">Total Progress</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{completionRate}%</div>
                <p className="text-sm text-slate-600">Completion Rate</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-purple-600">{challenges.length}</div>
                <p className="text-sm text-slate-600">Available Challenges</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {difficulties.map(difficulty => (
            <Button
              key={difficulty}
              variant={selectedDifficulty === difficulty ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty(difficulty)}
            >
              {difficulty}
            </Button>
          ))}
        </div>
      </div>

      {/* Challenges Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map(challenge => (
            <Card key={challenge.id} className={`relative ${challenge.joined ? 'border-blue-200 bg-blue-50' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{challenge.name}</CardTitle>
                    <CardDescription className="mt-1">{challenge.description}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                    <Badge className={getCategoryColor(challenge.category)}>
                      {getCategoryIcon(challenge.category)}
                      <span className="ml-1">{challenge.category}</span>
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <Users className="h-4 w-4 text-slate-500" />
                  <span className="text-sm text-slate-600">{challenge.participants} participants</span>
                  <Clock className="h-4 w-4 text-slate-500 ml-2" />
                  <span className="text-sm text-slate-600">{challenge.duration} days</span>
                </div>

                {challenge.joined && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Your Progress</span>
                      <span className="text-sm text-slate-600">{challenge.progress}/{challenge.target}</span>
                    </div>
                    <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="pt-0">
                {challenge.joined ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => logProgress(challenge.id)}
                        disabled={challenge.progress >= challenge.target}
                        className="flex-1"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> 
                        Log Progress
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => leaveChallenge(challenge.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> 
                        Leave
                      </Button>
                    </div>
                    
                    {challenge.progress >= challenge.target && (
                      <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-800">Challenge Completed!</span>
                        </div>
                        <div className="mt-2">
                          <span className="text-sm font-medium text-green-700">Rewards:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {challenge.rewards.map((reward, index) => (
                              <Badge key={index} className="bg-green-200 text-green-800 text-xs">
                                {reward}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button onClick={() => joinChallenge(challenge.id)} className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Join Challenge
                  </Button>
                )}

                {/* Rewards Preview */}
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <span className="text-sm font-medium text-slate-700">Rewards:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {challenge.rewards.slice(0, 2).map((reward, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {reward}
                      </Badge>
                    ))}
                    {challenge.rewards.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{challenge.rewards.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {challenge.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredChallenges.map(challenge => (
            <Card key={challenge.id} className={`${challenge.joined ? 'border-blue-200 bg-blue-50' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{challenge.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{challenge.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-600">{challenge.participants} participants</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-600">{challenge.duration} days</span>
                        </div>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        <Badge className={getCategoryColor(challenge.category)}>
                          {challenge.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {challenge.joined ? (
                      <>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{challenge.progress}</div>
                          <div className="text-xs text-slate-500">Progress</div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => logProgress(challenge.id)}
                          disabled={challenge.progress >= challenge.target}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> 
                          Log
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => leaveChallenge(challenge.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" /> 
                          Leave
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => joinChallenge(challenge.id)}>
                        <Users className="h-4 w-4 mr-2" />
                        Join
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredChallenges.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No challenges found</h3>
            <p className="text-slate-500 mb-4">
              Try adjusting your filters to see available challenges.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 