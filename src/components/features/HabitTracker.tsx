import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Calendar as CalendarIcon,
  Activity,
  Target as TargetIcon,
  Users,
  DollarSign
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

export const HabitTracker: React.FC = () => {
  const { user, hasFeature, upgradePlan } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [notes, setNotes] = useState<HabitNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [newHabit, setNewHabit] = useState({ 
    name: '', 
    description: '', 
    goal: 1, 
    category: 'Health',
    difficulty: 'Medium' as const,
    priority: 'Medium' as const,
    reminderTime: '09:00',
    reminderEnabled: true
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showHabitDetails, setShowHabitDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState<{id: string, title: string, message: string, time: Date}[]>([]);

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

  // Load notes for a specific habit
  const loadHabitNotes = async (habitId: string) => {
    try {
      const supabaseNotes = await DataService.getHabitNotes(habitId);
      const transformedNotes: HabitNote[] = supabaseNotes.map(note => ({
        id: note.id,
        habitId: note.habit_id,
        content: note.content,
        date: new Date(note.date),
        mood: note.mood || undefined,
        energy: note.energy || undefined
      }));
      setNotes(transformedNotes);
    } catch (error) {
      console.error('Error loading habit notes:', error);
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id) return;

    const subscriptions = DataService.subscribeToUserData(user.id, {
      onHabitChange: (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
          loadHabits(); // Reload habits when changes occur
        }
      }
    });

    return () => {
      subscriptions.forEach(subscription => subscription.unsubscribe());
    };
  }, [user?.id]);

  // Handle file uploads
  const handleImageUpload = async (habitId: string, files: FileList) => {
    try {
      const newImages: string[] = [];
      for (const file of Array.from(files)) {
        const imageUrl = await DataService.uploadHabitImage(habitId, file);
        if (imageUrl) {
          newImages.push(imageUrl);
        }
      }
      
      if (newImages.length > 0) {
        const habit = habits.find(h => h.id === habitId);
        if (habit) {
          await DataService.updateHabit(habitId, {
            images: [...habit.images, ...newImages]
          });
          await loadHabits(); // Reload to get updated data
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  // Add note to habit
  const addNote = async (habitId: string, content: string, mood?: number, energy?: number) => {
    try {
      await DataService.addHabitNote({
        habitId,
        content,
        mood,
        energy
      });
      await loadHabitNotes(habitId);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  // Send notification
  const sendNotification = (title: string, message: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message });
    }
    
    const notification = {
      id: Date.now().toString(),
      title,
      message,
      time: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        sendNotification('Notifications Enabled', 'You will now receive habit reminders!');
      }
    }
  };

  const addHabit = async () => {
    if (!user?.id || !newHabit.name.trim()) return;

    try {
      setLoading(true);
      const habit = await DataService.createHabit({
        userId: user.id,
        name: newHabit.name,
        description: newHabit.description,
        goal: newHabit.goal,
        category: newHabit.category,
        difficulty: newHabit.difficulty,
        priority: newHabit.priority,
        reminderTime: newHabit.reminderTime,
        reminderEnabled: newHabit.reminderEnabled
      });

      if (habit) {
        setNewHabit({ 
          name: '', 
          description: '', 
          goal: 1, 
          category: 'Health',
          difficulty: 'Medium',
          priority: 'Medium',
          reminderTime: '09:00',
          reminderEnabled: true
        });
        setShowAddForm(false);
        await loadHabits(); // Reload habits
        sendNotification('Habit Created', `${newHabit.name} has been added to your tracker!`);
      }
    } catch (error) {
      console.error('Error creating habit:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (habitId: string) => {
    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;

      const completed = !habit.completedToday;
      const updatedHabit = await DataService.toggleHabitCompletion(habitId, completed);
      
      if (updatedHabit) {
        await loadHabits(); // Reload habits to get updated data
        
        if (completed) {
          sendNotification(
            'Habit Completed!', 
            `Great job completing "${habit.name}"! 🔥`
          );
        }
      }
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  const deleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return;

    try {
      const success = await DataService.deleteHabit(habitId);
      if (success) {
        await loadHabits(); // Reload habits
        sendNotification('Habit Deleted', 'Habit has been removed from your tracker.');
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const filteredHabits = habits.filter(habit => 
    selectedCategory === 'All' || habit.category === selectedCategory
  );

  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedToday).length;
  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const averageStreak = totalHabits > 0 ? Math.round(totalStreak / totalHabits) : 0;
  const totalCompletionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const maxHabits = user?.plan === 'Basic' ? 5 : user?.plan === 'Pro' ? 15 : 50;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Health': return <Target className="h-4 w-4" />;
      case 'Productivity': return <TrendingUp className="h-4 w-4" />;
      case 'Learning': return <BookOpen className="h-4 w-4" />;
      case 'Fitness': return <Zap className="h-4 w-4" />;
      case 'Mindfulness': return <Award className="h-4 w-4" />;
      case 'Social': return <Users className="h-4 w-4" />;
      case 'Finance': return <DollarSign className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Health': return 'bg-green-100 text-green-800';
      case 'Productivity': return 'bg-blue-100 text-blue-800';
      case 'Learning': return 'bg-purple-100 text-purple-800';
      case 'Fitness': return 'bg-orange-100 text-orange-800';
      case 'Mindfulness': return 'bg-indigo-100 text-indigo-800';
      case 'Social': return 'bg-pink-100 text-pink-800';
      case 'Finance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
      case 'Low': return 'bg-gray-100 text-gray-800';
      case 'Medium': return 'bg-blue-100 text-blue-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Habit Tracker</CardTitle>
          <CardDescription>Please sign in to access habit tracking</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with real-time clock */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Habit Tracker</h2>
          <p className="text-slate-600">Build lasting habits and track your progress</p>
          <p className="text-sm text-gray-500 mt-1">
            {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={user.plan === 'Premium' ? 'bg-purple-600' : user.plan === 'Pro' ? 'bg-indigo-600' : 'bg-blue-600'}>
            {user.plan} Plan
          </Badge>
          <Button onClick={requestNotificationPermission} variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Enable Notifications
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Habits</p>
                <p className="text-2xl font-bold">{totalHabits}/{maxHabits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold">{completedToday}/{totalHabits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Average Streak</p>
                <p className="text-2xl font-bold">{averageStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{totalCompletionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Habit
        </Button>
      </div>

      {/* Habits Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {loading ? (
          <p>Loading habits...</p>
        ) : filteredHabits.length === 0 ? (
          <p>No habits found in this category. Add one to get started!</p>
        ) : (
          filteredHabits.map(habit => (
            <Card key={habit.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(habit.category)}
                    <div>
                      <CardTitle className="text-lg">{habit.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getCategoryColor(habit.category)} variant="secondary">
                          {habit.category}
                        </Badge>
                        <Badge className={getDifficultyColor(habit.difficulty)} variant="secondary">
                          {habit.difficulty}
                        </Badge>
                        <Badge className={getPriorityColor(habit.priority)} variant="secondary">
                          {habit.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={habit.completedToday ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleHabit(habit.id)}
                      className={habit.completedToday ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {habit.completedToday ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedHabit(habit);
                        setShowHabitDetails(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{habit.description}</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Current Streak</span>
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">{habit.streak} days</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Best Streak</span>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{habit.bestStreak} days</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Total Days</span>
                    <span className="font-medium">{habit.totalDays} days</span>
                  </div>
                  {habit.reminderEnabled && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Reminder</span>
                      <div className="flex items-center gap-1">
                        <Bell className="h-4 w-4 text-blue-500" />
                        <span className="font-medium">{habit.reminderTime}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Habit Modal */}
      {showAddForm && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add New Habit</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Habit Name</Label>
                <Input
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  placeholder="e.g., Morning Exercise"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                  placeholder="Describe your habit..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={newHabit.category} onValueChange={(value) => setNewHabit({...newHabit, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat !== 'All').map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Daily Goal</Label>
                  <Input
                    type="number"
                    value={newHabit.goal}
                    onChange={(e) => setNewHabit({...newHabit, goal: parseInt(e.target.value)})}
                    min="1"
                    max="10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Difficulty</Label>
                  <Select value={newHabit.difficulty} onValueChange={(value) => setNewHabit({...newHabit, difficulty: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map(difficulty => (
                        <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={newHabit.priority} onValueChange={(value) => setNewHabit({...newHabit, priority: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newHabit.reminderEnabled}
                  onCheckedChange={(checked) => setNewHabit({...newHabit, reminderEnabled: checked})}
                />
                <Label>Enable Reminder</Label>
              </div>
              {newHabit.reminderEnabled && (
                <div>
                  <Label>Reminder Time</Label>
                  <Input
                    type="time"
                    value={newHabit.reminderTime}
                    onChange={(e) => setNewHabit({...newHabit, reminderTime: e.target.value})}
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={addHabit} className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Habit
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}

      {/* Habit Details Modal */}
      {showHabitDetails && selectedHabit && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getCategoryIcon(selectedHabit.category)}
                  {selectedHabit.name}
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowHabitDetails(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="progress">Progress</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="images">Images</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <Flame className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">{selectedHabit.streak}</p>
                          <p className="text-sm text-gray-600">Current Streak</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">{selectedHabit.bestStreak}</p>
                          <p className="text-sm text-gray-600">Best Streak</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">{selectedHabit.totalDays}</p>
                          <p className="text-sm text-gray-600">Total Days</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <p className="text-gray-600">{selectedHabit.description}</p>
                </TabsContent>

                <TabsContent value="progress" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Weekly Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-1">
                          {selectedHabit.weeklyProgress.map((day, index) => (
                            <div key={index} className="flex-1 bg-gray-200 rounded" style={{height: `${day * 10}px`}}></div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">Last 7 days</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Monthly Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-7 gap-1">
                          {selectedHabit.monthlyProgress.slice(0, 31).map((day, index) => (
                            <div key={index} className="bg-gray-200 rounded" style={{height: `${day * 5}px`}}></div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">This month</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input placeholder="Add a note..." />
                    <Button>Add Note</Button>
                  </div>
                  <div className="space-y-2">
                    {notes.filter(note => note.habitId === selectedHabit.id).map(note => (
                      <Card key={note.id}>
                        <CardContent className="p-3">
                          <p className="text-sm">{note.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {note.date.toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="images" className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => e.target.files && handleImageUpload(selectedHabit.id, e.target.files)}
                    />
                    <Button>Upload Images</Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedHabit.images.map((image, index) => (
                      <img key={index} src={image} alt={`Progress ${index + 1}`} className="w-full h-32 object-cover rounded" />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Reminder Time</Label>
                      <Input
                        type="time"
                        value={selectedHabit.reminderTime}
                        onChange={(e) => setHabits(prev => prev.map(h => 
                          h.id === selectedHabit.id 
                            ? {...h, reminderTime: e.target.value}
                            : h
                        ))}
                      />
                    </div>
                    <div>
                      <Label>Difficulty</Label>
                      <Select 
                        value={selectedHabit.difficulty} 
                        onValueChange={(value) => setHabits(prev => prev.map(h => 
                          h.id === selectedHabit.id 
                            ? {...h, difficulty: value as any}
                            : h
                        ))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {difficulties.map(difficulty => (
                            <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={selectedHabit.reminderEnabled}
                      onCheckedChange={(checked) => setHabits(prev => prev.map(h => 
                        h.id === selectedHabit.id 
                          ? {...h, reminderEnabled: checked}
                          : h
                      ))}
                    />
                    <Label>Enable Reminders</Label>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      deleteHabit(selectedHabit.id);
                      setShowHabitDetails(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Habit
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </Card>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          {notifications.map(notification => (
            <Card key={notification.id} className="w-80">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                  >
                    <X className="h-3 w-3" />
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