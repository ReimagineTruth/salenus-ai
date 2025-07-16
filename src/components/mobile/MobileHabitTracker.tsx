import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Check, 
  X, 
  Flame, 
  Calendar, 
  BarChart3, 
  Target,
  Lock,
  ArrowUp,
  TrendingUp,
  Clock,
  Award,
  Zap,
  List,
  BookOpen,
  Upload,
  Image,
  Bell,
  Settings,
  Download,
  Share2,
  Edit,
  Trash2,
  Camera,
  FileText,
  Star,
  Trophy,
  Activity,
  Target as TargetIcon,
  Users,
  DollarSign,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Filter,
  Search,
  MoreVertical,
  Heart,
  Smile,
  Frown,
  Meh
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DataService } from '@/lib/data-service';
import type { Habit as SupabaseHabit, HabitNote as SupabaseHabitNote } from '@/lib/supabase';

interface Habit {
  id: string;
  name: string;
  description: string;
  streak: number;
  totalDays: number;
  completedToday: boolean;
  goal: number;
  category: string;
  createdAt: Date;
  lastCompleted?: Date;
  bestStreak: number;
  weeklyProgress: number[];
  monthlyProgress: number[];
  yearlyProgress: number[];
  images: string[];
  notes: string[];
  reminderTime?: string;
  reminderEnabled: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  milestones: { id: string; title: string; target: number; achieved: boolean; date?: Date }[];
}

interface HabitNote {
  id: string;
  habitId: string;
  content: string;
  date: Date;
  mood?: number;
  energy?: number;
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
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const supabaseHabits = await DataService.getHabits(user.id);
      const transformedHabits: Habit[] = supabaseHabits.map(habit => ({
        id: habit.id,
        name: habit.name,
        description: habit.description,
        streak: habit.streak,
        totalDays: habit.total_days,
        completedToday: habit.completed_today,
        goal: habit.goal,
        category: habit.category,
        createdAt: new Date(habit.created_at),
        lastCompleted: habit.last_completed ? new Date(habit.last_completed) : undefined,
        bestStreak: habit.best_streak,
        weeklyProgress: habit.weekly_progress,
        monthlyProgress: habit.monthly_progress,
        yearlyProgress: habit.yearly_progress,
        images: habit.images,
        notes: habit.notes,
        reminderTime: habit.reminder_time,
        reminderEnabled: habit.reminder_enabled,
        difficulty: habit.difficulty,
        priority: habit.priority,
        tags: habit.tags,
        milestones: habit.milestones
      }));
      setHabits(transformedHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      loadHabits();
      setIsRefreshing(false);
    }, 1000);
  };

  // Handle swipe gestures
  const handleSwipe = (habitId: string, direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    setTimeout(() => setSwipeDirection(null), 300);

    if (direction === 'right') {
      // Mark as completed
      toggleHabit(habitId);
    } else if (direction === 'left') {
      // Show details
      const habit = habits.find(h => h.id === habitId);
      if (habit) {
        setSelectedHabit(habit);
        setShowHabitDetails(true);
      }
    }
  };

  const toggleHabit = async (habitId: string) => {
    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;

      const completed = !habit.completedToday;
      const updatedHabit = await DataService.toggleHabitCompletion(habitId, completed);
      
      if (updatedHabit) {
        await loadHabits();
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const filteredHabits = habits.filter(habit => {
    const matchesCategory = selectedCategory === 'All' || habit.category === selectedCategory;
    const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         habit.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'Health': <Heart className="h-4 w-4" />,
      'Productivity': <Target className="h-4 w-4" />,
      'Learning': <BookOpen className="h-4 w-4" />,
      'Fitness': <Activity className="h-4 w-4" />,
      'Mindfulness': <Smile className="h-4 w-4" />,
      'Social': <Users className="h-4 w-4" />,
      'Finance': <DollarSign className="h-4 w-4" />
    };
    return icons[category] || <Star className="h-4 w-4" />;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Health': 'bg-red-100 text-red-800',
      'Productivity': 'bg-blue-100 text-blue-800',
      'Learning': 'bg-green-100 text-green-800',
      'Fitness': 'bg-purple-100 text-purple-800',
      'Mindfulness': 'bg-yellow-100 text-yellow-800',
      'Social': 'bg-pink-100 text-pink-800',
      'Finance': 'bg-emerald-100 text-emerald-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      'Easy': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'Hard': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'Low': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'High': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* Header with search and filters */}
      <div className="sticky top-0 bg-white z-10 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-gray-900">Habits</h1>
            <Badge variant="secondary" className="text-xs">
              {habits.filter(h => h.completedToday).length}/{habits.length}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category filters */}
        {showFilters && (
          <div className="mb-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {getCategoryIcon(category)}
                  <span className="ml-1">{category}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* View mode toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'calendar' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Habit
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading habits...</span>
        </div>
      )}

      {/* Habits list */}
      {!loading && (
        <div className="space-y-3">
          {filteredHabits.length === 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No habits found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'Try adjusting your search terms.' : 'Create your first habit to get started!'}
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Habit
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredHabits.map((habit) => (
              <Card
                key={habit.id}
                className={`transition-all duration-300 cursor-pointer hover:shadow-md ${
                  swipeDirection === 'left' ? 'transform -translate-x-4' : 
                  swipeDirection === 'right' ? 'transform translate-x-4' : ''
                }`}
                onClick={() => handleSwipe(habit.id, 'left')}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                        <Badge className={getCategoryColor(habit.category)}>
                          {habit.category}
                        </Badge>
                        {habit.completedToday && (
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="h-3 w-3 mr-1" />
                            Done
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-1">
                          <Flame className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium">{habit.streak} day streak</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{habit.totalDays} total days</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">Best: {habit.bestStreak}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Today's Progress</span>
                          <span className="text-xs font-medium">
                            {habit.completedToday ? '100%' : '0%'}
                          </span>
                        </div>
                        <Progress 
                          value={habit.completedToday ? 100 : 0} 
                          className="h-2"
                        />
                      </div>

                      {/* Difficulty and Priority badges */}
                      <div className="flex items-center space-x-2">
                        <Badge className={getDifficultyColor(habit.difficulty)}>
                          {habit.difficulty}
                        </Badge>
                        <Badge className={getPriorityColor(habit.priority)}>
                          {habit.priority}
                        </Badge>
                      </div>
                    </div>

                    {/* Quick action button */}
                    <Button
                      variant={habit.completedToday ? "outline" : "default"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleHabit(habit.id);
                      }}
                      className={`ml-3 ${
                        habit.completedToday 
                          ? 'border-green-500 text-green-600 hover:bg-green-50' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {habit.completedToday ? <Check className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Swipe instructions */}
      <div className="text-center py-4 text-sm text-gray-500">
        <p>Swipe right to complete • Swipe left for details</p>
      </div>

      {/* Add habit form modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Habit</CardTitle>
            </CardHeader>
            <CardContent>
              <MobileAddHabitForm
                onClose={() => setShowAddForm(false)}
                onSuccess={() => {
                  setShowAddForm(false);
                  loadHabits();
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Habit details modal */}
      {showHabitDetails && selectedHabit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Habit Details</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHabitDetails(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <MobileHabitDetails
                habit={selectedHabit}
                onClose={() => setShowHabitDetails(false)}
                onUpdate={loadHabits}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Mobile Add Habit Form Component
const MobileAddHabitForm: React.FC<{
  onClose: () => void;
  onSuccess: () => void;
}> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Health',
    difficulty: 'Medium' as const,
    priority: 'Medium' as const,
    goal: 1,
    reminderTime: '09:00',
    reminderEnabled: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !formData.name.trim()) return;

    try {
      await DataService.createHabit({
        userId: user.id,
        name: formData.name,
        description: formData.description,
        goal: formData.goal,
        category: formData.category,
        difficulty: formData.difficulty,
        priority: formData.priority,
        reminderTime: formData.reminderTime,
        reminderEnabled: formData.reminderEnabled
      });
      onSuccess();
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Habit Name
        </label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Morning Exercise"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your habit..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['Health', 'Productivity', 'Learning', 'Fitness', 'Mindfulness', 'Social', 'Finance'].map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Goal (times/day)
          </label>
          <Input
            type="number"
            min="1"
            max="10"
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: parseInt(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <Select
            value={formData.difficulty}
            onValueChange={(value: 'Easy' | 'Medium' | 'Hard') => setFormData({ ...formData, difficulty: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <Select
            value={formData.priority}
            onValueChange={(value: 'Low' | 'Medium' | 'High') => setFormData({ ...formData, priority: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['Low', 'Medium', 'High'].map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.reminderEnabled}
            onCheckedChange={(checked) => setFormData({ ...formData, reminderEnabled: checked })}
          />
          <label className="text-sm font-medium text-gray-700">
            Daily Reminder
          </label>
        </div>
        
        {formData.reminderEnabled && (
          <Input
            type="time"
            value={formData.reminderTime}
            onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
            className="w-32"
          />
        )}
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          Create Habit
        </Button>
      </div>
    </form>
  );
};

// Mobile Habit Details Component
const MobileHabitDetails: React.FC<{
  habit: Habit;
  onClose: () => void;
  onUpdate: () => void;
}> = ({ habit, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{habit.name}</h3>
            <p className="text-gray-600 mb-4">{habit.description}</p>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{habit.streak}</div>
                <div className="text-xs text-gray-500">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{habit.bestStreak}</div>
                <div className="text-xs text-gray-500">Best Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{habit.totalDays}</div>
                <div className="text-xs text-gray-500">Total Days</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Category</span>
                <Badge>{habit.category}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Difficulty</span>
                <Badge>{habit.difficulty}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Priority</span>
                <Badge>{habit.priority}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Daily Goal</span>
                <span className="text-sm font-medium">{habit.goal}x</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Weekly Progress</h4>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={day} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{day}</div>
                  <div className="h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">
                    {habit.weeklyProgress[index] || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Journal Entries</h4>
            {habit.notes.length > 0 ? (
              <div className="space-y-3">
                {habit.notes.map((note, index) => (
                  <Card key={index}>
                    <CardContent className="p-3">
                      <p className="text-sm text-gray-700">{note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No journal entries yet</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex space-x-3 pt-4">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Close
        </Button>
        <Button onClick={onUpdate} className="flex-1">
          Update
        </Button>
      </div>
    </div>
  );
}; 