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
  ArrowUp
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
}

export const HabitTracker: React.FC = () => {
  const { user, hasFeature, upgradePlan } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState({ name: '', description: '', goal: 1, category: 'Health' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

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
      createdAt: new Date()
    };

    setHabits([...habits, habit]);
    setNewHabit({ name: '', description: '', goal: 1, category: 'Health' });
    setShowAddForm(false);
  };

  const toggleHabit = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completedToday = !habit.completedToday;
        return {
          ...habit,
          completedToday,
          streak: completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1),
          totalDays: completedToday ? habit.totalDays + 1 : habit.totalDays
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

  const maxHabits = user?.plan === 'Basic' ? 5 : user?.plan === 'Pro' ? 15 : 50;

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
        <Badge className={user.plan === 'Premium' ? 'bg-purple-600' : user.plan === 'Pro' ? 'bg-indigo-600' : 'bg-blue-600'}>
          {user.plan} Plan
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-800">{totalHabits}</div>
            <p className="text-sm text-slate-600">Total Habits</p>
            <Progress value={(totalHabits / maxHabits) * 100} className="mt-2" />
            <p className="text-xs text-slate-500 mt-1">{totalHabits}/{maxHabits} limit</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{completedToday}</div>
            <p className="text-sm text-slate-600">Completed Today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600">{totalStreak}</div>
            <p className="text-sm text-slate-600">Total Streak Days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{averageStreak}</div>
            <p className="text-sm text-slate-600">Avg. Streak</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHabits.map(habit => (
          <Card key={habit.id} className={`transition-all duration-200 hover:shadow-lg ${
            habit.completedToday ? 'border-green-200 bg-green-50' : 'border-slate-200'
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{habit.name}</CardTitle>
                  <CardDescription>{habit.description}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteHabit(habit.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="outline">{habit.category}</Badge>
                <div className="flex items-center space-x-1">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">{habit.streak} days</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Today's Progress</span>
                  <span className="text-sm font-medium">
                    {habit.completedToday ? 'Completed' : 'Not Done'}
                  </span>
                </div>
                
                <Button
                  className={`w-full ${
                    habit.completedToday 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                  onClick={() => toggleHabit(habit.id)}
                >
                  {habit.completedToday ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Mark Complete
                    </>
                  )}
                </Button>
                
                <div className="text-xs text-slate-500">
                  Created {habit.createdAt.toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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