import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Plus, 
  Target, 
  Calendar, 
  BarChart3, 
  Filter, 
  Search, 
  CheckCircle, 
  Circle, 
  Clock, 
  Flame, 
  Star, 
  Camera, 
  MessageSquare, 
  MoreVertical,
  ChevronRight,
  RefreshCw,
  TrendingUp,
  Award,
  Zap,
  Heart,
  BookOpen,
  Settings,
  Share2,
  Download,
  Upload
} from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  priority: 'Low' | 'Medium' | 'High';
  streak: number;
  totalDays: number;
  completedToday: boolean;
  goal: number;
  createdAt: string;
  lastCompleted: string | null;
  bestStreak: number;
  reminderTime: string | null;
  reminderEnabled: boolean;
  tags: string[];
}

interface HabitNote {
  id: string;
  habitId: string;
  content: string;
  date: string;
  mood: number | null;
  energy: number | null;
}

export const MobileHabitTracker: React.FC = () => {
  const { user, hasFeature, upgradePlan } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [notes, setNotes] = useState<HabitNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'calendar'>('list');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showHabitDetails, setShowHabitDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [pullToRefreshY, setPullToRefreshY] = useState(0);

  // Touch gesture refs
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchEndRef = useRef<{ x: number; y: number } | null>(null);

  const categories = ['All', 'Health', 'Productivity', 'Learning', 'Fitness', 'Mindfulness', 'Social', 'Finance'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const priorities = ['Low', 'Medium', 'High'];

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load habits from Supabase
  useEffect(() => {
    if (user?.id) {
      loadHabits();
    }
  }, [user?.id]);

  const loadHabits = async () => {
    setLoading(true);
    try {
      // Simulate loading habits
      const mockHabits: Habit[] = [
        {
          id: '1',
          name: 'Morning Exercise',
          description: '30 minutes of cardio or strength training',
          category: 'Fitness',
          difficulty: 'Medium',
          priority: 'High',
          streak: 7,
          totalDays: 15,
          completedToday: false,
          goal: 30,
          createdAt: new Date().toISOString(),
          lastCompleted: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          bestStreak: 12,
          reminderTime: '07:00',
          reminderEnabled: true,
          tags: ['fitness', 'morning', 'health']
        },
        {
          id: '2',
          name: 'Read 30 Minutes',
          description: 'Read a book or educational content',
          category: 'Learning',
          difficulty: 'Easy',
          priority: 'Medium',
          streak: 3,
          totalDays: 8,
          completedToday: true,
          goal: 21,
          createdAt: new Date().toISOString(),
          lastCompleted: new Date().toISOString(),
          bestStreak: 5,
          reminderTime: '20:00',
          reminderEnabled: true,
          tags: ['learning', 'reading', 'education']
        },
        {
          id: '3',
          name: 'Meditation',
          description: '10 minutes of mindfulness meditation',
          category: 'Mindfulness',
          difficulty: 'Easy',
          priority: 'Medium',
          streak: 5,
          totalDays: 12,
          completedToday: false,
          goal: 21,
          createdAt: new Date().toISOString(),
          lastCompleted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          bestStreak: 8,
          reminderTime: '18:00',
          reminderEnabled: false,
          tags: ['mindfulness', 'meditation', 'wellness']
        }
      ];
      
      setHabits(mockHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
      toast({
        title: "Error",
        description: "Failed to load habits. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle pull-to-refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const startY = touchStartRef.current.y;
    const deltaY = currentY - startY;
    
    // Only allow pull-to-refresh if at top of page
    if (window.scrollY === 0 && deltaY > 0) {
      setPullToRefreshY(Math.min(deltaY * 0.5, 100));
    }
  };

  const handleTouchEnd = () => {
    if (pullToRefreshY > 50) {
      handleRefresh();
    }
    setPullToRefreshY(0);
    touchStartRef.current = null;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadHabits().finally(() => {
      setIsRefreshing(false);
    });
  };

  // Handle swipe gestures for habits
  const handleHabitSwipe = (habitId: string, direction: 'left' | 'right') => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    if (direction === 'right') {
      // Complete habit
      completeHabit(habitId);
    } else if (direction === 'left') {
      // View details
      setSelectedHabit(habit);
      setShowHabitDetails(true);
    }
  };

  const completeHabit = async (habitId: string) => {
    try {
      setHabits(prev => prev.map(habit => 
        habit.id === habitId 
          ? { 
              ...habit, 
              completedToday: true, 
              streak: habit.streak + 1,
              totalDays: habit.totalDays + 1,
              lastCompleted: new Date().toISOString()
            }
          : habit
      ));

      toast({
        title: "Habit Completed! 🎉",
        description: "Great job! Keep up the streak!",
      });
    } catch (error) {
      console.error('Error completing habit:', error);
      toast({
        title: "Error",
        description: "Failed to complete habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const addHabit = async (habitData: Partial<Habit>) => {
    try {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: habitData.name || '',
        description: habitData.description || '',
        category: habitData.category || 'Productivity',
        difficulty: habitData.difficulty || 'Medium',
        priority: habitData.priority || 'Medium',
        streak: 0,
        totalDays: 0,
        completedToday: false,
        goal: habitData.goal || 21,
        createdAt: new Date().toISOString(),
        lastCompleted: null,
        bestStreak: 0,
        reminderTime: null,
        reminderEnabled: false,
        tags: habitData.tags || []
      };

      setHabits(prev => [...prev, newHabit]);
      setShowAddForm(false);

      toast({
        title: "Habit Created! 🎯",
        description: "Your new habit has been added successfully.",
      });
    } catch (error) {
      console.error('Error adding habit:', error);
      toast({
        title: "Error",
        description: "Failed to create habit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredHabits = habits.filter(habit => {
    const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         habit.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || habit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="min-h-screen bg-gray-50 pb-20"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull-to-refresh indicator */}
      {pullToRefreshY > 0 && (
        <div 
          className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-blue-500 text-white py-2"
          style={{ transform: `translateY(${pullToRefreshY}px)` }}
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Habit Tracker</h1>
              <p className="text-sm text-gray-500">
                {currentTime.toLocaleTimeString()} • {filteredHabits.length} habits
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="p-2"
            >
              <Filter className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="p-2"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search habits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mt-3 flex space-x-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Current Streak</p>
                  <p className="text-2xl font-bold">
                    {habits.reduce((sum, habit) => sum + habit.streak, 0)}
                  </p>
                </div>
                <Flame className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Completed Today</p>
                  <p className="text-2xl font-bold">
                    {habits.filter(h => h.completedToday).length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Your Habits</h2>
          <div className="flex space-x-1">
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Target className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Habits List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredHabits.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No habits found</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'Try adjusting your search terms.' : 'Create your first habit to get started!'}
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredHabits.map((habit) => (
              <Card 
                key={habit.id} 
                className={`transition-all duration-200 ${
                  habit.completedToday ? 'bg-green-50 border-green-200' : ''
                }`}
                onTouchStart={(e) => {
                  touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                }}
                onTouchEnd={(e) => {
                  if (!touchStartRef.current) return;
                  const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
                  if (Math.abs(deltaX) > 50) {
                    handleHabitSwipe(habit.id, deltaX > 0 ? 'right' : 'left');
                  }
                  touchStartRef.current = null;
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                        {habit.completedToday && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge className={getDifficultyColor(habit.difficulty)}>
                          {habit.difficulty}
                        </Badge>
                        <Badge className={getPriorityColor(habit.priority)}>
                          {habit.priority}
                        </Badge>
                        <Badge variant="outline">
                          {habit.category}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Flame className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-medium">{habit.streak} days</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">{habit.totalDays}/{habit.goal}</span>
                          </div>
                        </div>
                        
                        <Button
                          variant={habit.completedToday ? "outline" : "default"}
                          size="sm"
                          onClick={() => completeHabit(habit.id)}
                          disabled={habit.completedToday}
                        >
                          {habit.completedToday ? 'Completed' : 'Complete'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Habit Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Habit Name</label>
              <Input placeholder="e.g., Morning Exercise" />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe your habit..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== 'All').map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Difficulty</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                addHabit({
                  name: 'New Habit',
                  description: 'Description',
                  category: 'Productivity',
                  difficulty: 'Medium',
                  priority: 'Medium',
                  goal: 21
                });
              }}>
                Create Habit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Habit Details Dialog */}
      <Dialog open={showHabitDetails} onOpenChange={setShowHabitDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedHabit?.name}</DialogTitle>
          </DialogHeader>
          {selectedHabit && (
            <div className="space-y-4">
              <p className="text-gray-600">{selectedHabit.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{selectedHabit.streak}</p>
                  <p className="text-sm text-blue-600">Current Streak</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{selectedHabit.bestStreak}</p>
                  <p className="text-sm text-green-600">Best Streak</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium">
                    {selectedHabit.totalDays}/{selectedHabit.goal} days
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((selectedHabit.totalDays / selectedHabit.goal) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Photo
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Note
                </Button>
                <Button variant="outline" className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}; 