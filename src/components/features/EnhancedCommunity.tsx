import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  Trophy, 
  Star, 
  Heart,
  MessageSquare,
  Share2,
  TrendingUp,
  Target,
  Calendar,
  Clock,
  Award,
  Crown,
  Zap,
  Flame,
  Gift,
  Bell,
  Search,
  Filter,
  Plus,
  Eye,
  EyeOff,
  ThumbsUp,
  MessageCircle,
  Share,
  Bookmark,
  MoreHorizontal,
  CheckCircle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  participants: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  progress: number;
  reward: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isJoined: boolean;
  isCompleted: boolean;
  leaderboard: User[];
  tags: string[];
}

interface User {
  id: string;
  name: string;
  avatar: string;
  points: number;
  level: number;
  streak: number;
  achievements: string[];
  isOnline: boolean;
}

interface Post {
  id: string;
  user: User;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  tags: string[];
}

export const EnhancedCommunity: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: '30-Day Fitness Challenge',
      description: 'Complete 30 days of consistent exercise and build healthy habits together.',
      category: 'Fitness',
      participants: 156,
      maxParticipants: 200,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      progress: 65,
      reward: '500 Pi + Fitness Badge',
      difficulty: 'Medium',
      isJoined: true,
      isCompleted: false,
      leaderboard: [
        { id: '1', name: 'Sarah Johnson', avatar: '/avatars/sarah.jpg', points: 2850, level: 8, streak: 25, achievements: ['Fitness Master'], isOnline: true },
        { id: '2', name: 'Mike Chen', avatar: '/avatars/mike.jpg', points: 2720, level: 7, streak: 22, achievements: ['Consistency King'], isOnline: false },
        { id: '3', name: 'Emma Davis', avatar: '/avatars/emma.jpg', points: 2680, level: 7, streak: 20, achievements: ['Early Bird'], isOnline: true }
      ],
      tags: ['fitness', 'health', 'motivation']
    },
    {
      id: '2',
      title: 'Productivity Sprint',
      description: 'Boost your productivity with focused work sessions and goal achievement.',
      category: 'Productivity',
      participants: 89,
      maxParticipants: 150,
      startDate: '2024-01-20',
      endDate: '2024-02-05',
      progress: 45,
      reward: '300 Pi + Productivity Badge',
      difficulty: 'Hard',
      isJoined: false,
      isCompleted: false,
      leaderboard: [
        { id: '4', name: 'Alex Thompson', avatar: '/avatars/alex.jpg', points: 3200, level: 9, streak: 30, achievements: ['Productivity Master'], isOnline: true },
        { id: '5', name: 'Lisa Wang', avatar: '/avatars/lisa.jpg', points: 2980, level: 8, streak: 28, achievements: ['Goal Crusher'], isOnline: true },
        { id: '6', name: 'David Kim', avatar: '/avatars/david.jpg', points: 2750, level: 7, streak: 25, achievements: ['Focus Master'], isOnline: false }
      ],
      tags: ['productivity', 'goals', 'focus']
    }
  ]);

  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user: { id: '1', name: 'Sarah Johnson', avatar: '/avatars/sarah.jpg', points: 2850, level: 8, streak: 25, achievements: ['Fitness Master'], isOnline: true },
      content: 'Just completed day 25 of the fitness challenge! Feeling stronger and more motivated than ever. 💪 Who else is crushing their goals?',
      likes: 24,
      comments: 8,
      shares: 3,
      timestamp: '2 hours ago',
      tags: ['fitness', 'motivation', 'challenge']
    },
    {
      id: '2',
      user: { id: '4', name: 'Alex Thompson', avatar: '/avatars/alex.jpg', points: 3200, level: 9, streak: 30, achievements: ['Productivity Master'], isOnline: true },
      content: 'Productivity tip: I\'ve been using the Pomodoro technique and it\'s been a game-changer! 25-minute focused sessions with 5-minute breaks. Highly recommend! 🍅',
      likes: 31,
      comments: 12,
      shares: 7,
      timestamp: '4 hours ago',
      tags: ['productivity', 'tips', 'pomodoro']
    }
  ]);

  const [currentUser, setCurrentUser] = useState<User>({
    id: 'current',
    name: 'Your Name',
    avatar: '/avatars/current.jpg',
    points: 1850,
    level: 6,
    streak: 15,
    achievements: ['Consistency King', 'Early Bird'],
    isOnline: true
  });

  const [activeTab, setActiveTab] = useState('challenges');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const joinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, isJoined: true, participants: challenge.participants + 1 }
        : challenge
    ));
  };

  const leaveChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(challenge => 
      challenge.id === challengeId 
        ? { ...challenge, isJoined: false, participants: challenge.participants - 1 }
        : challenge
    ));
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Easy: 'bg-green-100 text-green-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Hard: 'bg-red-100 text-red-800'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getLevelColor = (level: number) => {
    if (level >= 8) return 'text-purple-600';
    if (level >= 5) return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Hub</h1>
          <p className="text-gray-600 mt-2">Connect, compete, and grow with fellow productivity enthusiasts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Challenge
          </Button>
        </div>
      </div>

      {/* User Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{currentUser.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className={`font-medium ${getLevelColor(currentUser.level)}`}>Level {currentUser.level}</span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {currentUser.points} points
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    {currentUser.streak} day streak
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentUser.achievements.map((achievement, index) => (
                <Badge key={index} variant="secondary">
                  <Award className="h-3 w-3 mr-1" />
                  {achievement}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-4 border-b">
        <Button
          variant={activeTab === 'challenges' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('challenges')}
        >
          <Trophy className="h-4 w-4 mr-2" />
          Challenges
        </Button>
        <Button
          variant={activeTab === 'feed' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('feed')}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Community Feed
        </Button>
        <Button
          variant={activeTab === 'leaderboard' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('leaderboard')}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Leaderboard
        </Button>
        <Button
          variant={activeTab === 'friends' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('friends')}
        >
          <Users className="h-4 w-4 mr-2" />
          Friends
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search challenges, posts, or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="fitness">Fitness</SelectItem>
            <SelectItem value="productivity">Productivity</SelectItem>
            <SelectItem value="learning">Learning</SelectItem>
            <SelectItem value="mindfulness">Mindfulness</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {challenge.title}
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-2">{challenge.description}</CardDescription>
                  </div>
                  {challenge.isJoined && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Joined
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    <Users className="h-4 w-4 inline mr-1" />
                    {challenge.participants}/{challenge.maxParticipants} participants
                  </span>
                  <span className="text-gray-600">
                    <Calendar className="h-4 w-4 inline mr-1" />
                    {challenge.endDate}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">{challenge.reward}</span>
                  </div>
                  <div className="flex gap-2">
                    {challenge.isJoined ? (
                      <Button variant="outline" size="sm" onClick={() => leaveChallenge(challenge.id)}>
                        Leave
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => joinChallenge(challenge.id)}>
                        Join Challenge
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Leaderboard Preview */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Top Performers</h4>
                  <div className="space-y-2">
                    {challenge.leaderboard.slice(0, 3).map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">#{index + 1}</span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{user.name}</span>
                        </div>
                        <span className="text-sm font-medium">{user.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Create Post */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Share your progress, tips, or motivation with the community..."
                    className="min-h-[100px]"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Image
                      </Button>
                      <Button variant="outline" size="sm">
                        <Target className="h-4 w-4 mr-1" />
                        Add Goal
                      </Button>
                    </div>
                    <Button>Post</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Posts */}
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={post.user.avatar} />
                    <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{post.user.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        Level {post.user.level}
                      </Badge>
                      {post.user.isOnline && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{post.timestamp}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-gray-800 mb-4">{post.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => likePost(post.id)}
                      className="flex items-center gap-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      {post.comments}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Share className="h-4 w-4" />
                      {post.shares}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {challenges[0].leaderboard.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">Level {user.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{user.points}</p>
                        <p className="text-xs text-gray-500">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Longest Streaks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {challenges[0].leaderboard.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.streak} days</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Flame className="h-5 w-5 text-orange-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  Most Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {challenges[0].leaderboard.map((user, index) => (
                    <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.achievements.length} achievements</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Award className="h-5 w-5 text-purple-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'friends' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges[0].leaderboard.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-6 text-center">
                <Avatar className="h-16 w-16 mx-auto mb-4">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mb-1">{user.name}</h3>
                <p className="text-sm text-gray-500 mb-3">Level {user.level}</p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                  <span>{user.points} pts</span>
                  <span>{user.streak} day streak</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-1" />
                    Challenge
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}; 