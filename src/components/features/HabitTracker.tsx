import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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
}

export const HabitTracker: React.FC = () => {
  const { user, hasFeature, upgradePlan } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState({ name: '', description: '', goal: 1, category: 'Health' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  const categories = ['All', 'Health', 'Productivity', 'Learning', 'Fitness', 'Mindfulness'];

  // Load habits from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem(`habits_${user?.id}`);
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, [user?.id]);

  // Save habits to localStorage
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`habits_${user?.id}`, JSON.stringify(habits));
    }
  }, [habits, user?.id]);

  // Reset daily completion status at midnight
  useEffect(() => {
    const checkAndResetDaily = () => {
      const now = new Date();
      const lastReset = localStorage.getItem(`lastReset_${user?.id}`);
      const lastResetDate = lastReset ? new Date(lastReset) : null;
      
      if (!lastResetDate || lastResetDate.getDate() !== now.getDate()) {
        setHabits(prev => prev.map(habit => ({
          ...habit,
          completedToday: false
        })));
        localStorage.setItem(`lastReset_${user?.id}`, now.toISOString());
      }
    };

    checkAndResetDaily();
    const interval = setInterval(checkAndResetDaily, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user?.id]);

  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      description: newHabit.description,
      streak: 0,
      totalDays: 0,
      completedToday: false,
      goal: newHabit.goal,
      category: newHabit.category,
      createdAt: new Date(),
      bestStreak: 0,
      weeklyProgress: [0, 0, 0, 0, 0, 0, 0]
    };

    setHabits([...habits, habit]);
    setNewHabit({ name: '', description: '', goal: 1, category: 'Health' });
    setShowAddForm(false);
  };

  const toggleHabit = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completedToday = !habit.completedToday;
        const newStreak = completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1);
        const newBestStreak = Math.max(habit.bestStreak, newStreak);
        
        return {
          ...habit,
          completedToday,
          streak: newStreak,
          bestStreak: newBestStreak,
          totalDays: completedToday ? habit.totalDays + 1 : habit.totalDays,
          lastCompleted: completedToday ? new Date() : habit.lastCompleted
        };
      }
      return habit;
    }));
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Habit Tracker</h2>
          <p className="text-slate-600">Build lasting habits and track your progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={user.plan === 'Premium' ? 'bg-purple-600' : user.plan === 'Pro' ? 'bg-indigo-600' : 'bg-blue-600'}>
            {user.plan} Plan
          </Badge>
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

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-800">{totalHabits}</div>
                <p className="text-sm text-slate-600">Total Habits</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={(totalHabits / maxHabits) * 100} className="mt-2" />
            <p className="text-xs text-slate-500 mt-1">{totalHabits}/{maxHabits} limit</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedToday}</div>
                <p className="text-sm text-slate-600">Completed Today</p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Progress value={totalCompletionRate} className="mb-1" />
              <p className="text-xs text-slate-500">{totalCompletionRate}% completion rate</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{totalStreak}</div>
                <p className="text-sm text-slate-600">Total Streak Days</p>
              </div>
              <Flame className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Combined streak across all habits</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{averageStreak}</div>
                <p className="text-sm text-slate-600">Avg. Streak</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-slate-500 mt-1">Average streak per habit</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Habit */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add New Habit</CardTitle>
              <CardDescription>
                {user.plan === 'Basic' && totalHabits >= 5 && (
                  <span className="text-red-600">Upgrade to Pro to add more habits</span>
                )}
                {user.plan === 'Pro' && totalHabits >= 15 && (
                  <span className="text-red-600">Upgrade to Premium for unlimited habits</span>
                )}
              </CardDescription>
            </div>
            {totalHabits < maxHabits && (
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Habit
              </Button>
            )}
          </div>
        </CardHeader>
        
        {showAddForm && totalHabits < maxHabits && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="habit-name">Habit Name</Label>
                <Input
                  id="habit-name"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                  placeholder="e.g., Morning Exercise"
                />
              </div>
              <div>
                <Label htmlFor="habit-category">Category</Label>
                <select
                  id="habit-category"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                  value={newHabit.category}
                  onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="habit-description">Description (Optional)</Label>
              <Input
                id="habit-description"
                value={newHabit.description}
                onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                placeholder="Describe your habit goal"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={addHabit}>
                Add Habit
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Category Filter */}
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

      {/* Habits List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHabits.map(habit => (
            <Card key={habit.id} className={`relative ${habit.completedToday ? 'border-green-200 bg-green-50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{habit.name}</CardTitle>
                    <CardDescription className="mt-1">{habit.description}</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteHabit(habit.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getCategoryColor(habit.category)}>
                    {getCategoryIcon(habit.category)}
                    <span className="ml-1">{habit.category}</span>
                  </Badge>
                  {habit.completedToday && (
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Current Streak</span>
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="font-semibold">{habit.streak} days</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Best Streak</span>
                    <span className="font-semibold text-blue-600">{habit.bestStreak} days</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Total Days</span>
                    <span className="font-semibold">{habit.totalDays} days</span>
                  </div>
                  
                  <Button
                    onClick={() => toggleHabit(habit.id)}
                    variant={habit.completedToday ? "outline" : "default"}
                    className={`w-full ${habit.completedToday ? 'border-green-500 text-green-700' : ''}`}
                  >
                    {habit.completedToday ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Completed Today
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHabits.map(habit => (
            <Card key={habit.id} className={`${habit.completedToday ? 'border-green-200 bg-green-50' : ''}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => toggleHabit(habit.id)}
                      variant={habit.completedToday ? "outline" : "default"}
                      size="sm"
                      className={habit.completedToday ? 'border-green-500 text-green-700' : ''}
                    >
                      {habit.completedToday ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </Button>
                    <div>
                      <h3 className="font-semibold">{habit.name}</h3>
                      <p className="text-sm text-slate-600">{habit.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="font-semibold">{habit.streak}</span>
                      </div>
                      <span className="text-xs text-slate-500">Streak</span>
                    </div>
                    <div className="text-center">
                      <span className="font-semibold">{habit.totalDays}</span>
                      <span className="text-xs text-slate-500 block">Total</span>
                    </div>
                    <Badge className={getCategoryColor(habit.category)}>
                      {habit.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHabit(habit.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upgrade Prompt */}
      {totalHabits >= maxHabits && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-orange-800">Habit Limit Reached</h3>
                <p className="text-orange-700">
                  You've reached the maximum number of habits for your {user.plan} plan.
                  {user.plan === 'Basic' && ' Upgrade to Pro for 15 habits.'}
                  {user.plan === 'Pro' && ' Upgrade to Premium for unlimited habits.'}
                </p>
              </div>
              <Button 
                onClick={() => upgradePlan(user.plan === 'Basic' ? 'Pro' : 'Premium')}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredHabits.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">No habits yet</h3>
            <p className="text-slate-500 mb-4">
              Start building better habits by adding your first one above.
            </p>
            {totalHabits < maxHabits && (
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Habit
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 