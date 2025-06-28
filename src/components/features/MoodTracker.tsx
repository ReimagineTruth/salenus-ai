import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Smile, 
  Frown, 
  Meh, 
  Heart, 
  BarChart3, 
  Calendar,
  Lock,
  ArrowUp,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5 scale
  energy: number; // 1-5 scale
  notes: string;
  activities: string[];
  createdAt: Date;
}

const moodEmojis = ['😢', '😕', '😐', '🙂', '😄'];
const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
const energyLabels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];

export const MoodTracker: React.FC = () => {
  const { user, hasFeature, upgradePlan } = useAuth();
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [todayEntry, setTodayEntry] = useState<Partial<MoodEntry>>({
    mood: 3,
    energy: 3,
    notes: '',
    activities: []
  });
  const [showEntryForm, setShowEntryForm] = useState(false);

  const activities = [
    'Exercise', 'Work', 'Social', 'Sleep', 'Food', 
    'Reading', 'Music', 'Nature', 'Family', 'Hobbies'
  ];

  // Load mood entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem(`mood_${user?.id}`);
    if (savedEntries) {
      setMoodEntries(JSON.parse(savedEntries));
    }
  }, [user?.id]);

  // Save mood entries to localStorage
  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`mood_${user?.id}`, JSON.stringify(moodEntries));
    }
  }, [moodEntries, user?.id]);

  const addMoodEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = moodEntries.find(entry => entry.date === today);
    
    if (existingEntry) {
      setMoodEntries(moodEntries.map(entry => 
        entry.date === today 
          ? { ...entry, ...todayEntry, id: entry.id }
          : entry
      ));
    } else {
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        date: today,
        mood: todayEntry.mood || 3,
        energy: todayEntry.energy || 3,
        notes: todayEntry.notes || '',
        activities: todayEntry.activities || [],
        createdAt: new Date()
      };
      setMoodEntries([...moodEntries, newEntry]);
    }
    
    setTodayEntry({ mood: 3, energy: 3, notes: '', activities: [] });
    setShowEntryForm(false);
  };

  const toggleActivity = (activity: string) => {
    const currentActivities = todayEntry.activities || [];
    const updatedActivities = currentActivities.includes(activity)
      ? currentActivities.filter(a => a !== activity)
      : [...currentActivities, activity];
    
    setTodayEntry({ ...todayEntry, activities: updatedActivities });
  };

  const getTodayEntry = () => {
    const today = new Date().toISOString().split('T')[0];
    return moodEntries.find(entry => entry.date === today);
  };

  const todayEntryData = getTodayEntry();
  const averageMood = moodEntries.length > 0 
    ? moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length 
    : 0;
  const averageEnergy = moodEntries.length > 0 
    ? moodEntries.reduce((sum, entry) => sum + entry.energy, 0) / moodEntries.length 
    : 0;

  // Check if user has access to mood tracking
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mood Tracker</CardTitle>
          <CardDescription>Please sign in to access mood tracking</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!hasFeature('mood_tracking')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Mood Tracking</h3>
            <p className="text-slate-500 mb-4">
              Track your daily mood and energy levels to understand your patterns and get personalized recommendations.
            </p>
            <Button 
              onClick={() => upgradePlan(user.plan === 'Basic' ? 'Pro' : 'Premium')}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Upgrade to {user.plan === 'Basic' ? 'Pro' : 'Premium'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Mood Tracker</h2>
          <p className="text-slate-600">Track your daily mood and energy levels</p>
        </div>
        <Badge className={user.plan === 'Premium' ? 'bg-purple-600' : 'bg-indigo-600'}>
          {user.plan} Plan
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-800">{moodEntries.length}</div>
            <p className="text-sm text-slate-600">Days Tracked</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{averageMood.toFixed(1)}</div>
            <p className="text-sm text-slate-600">Avg. Mood</p>
            <div className="text-xs text-slate-500 mt-1">
              {moodEmojis[Math.round(averageMood) - 1]} {moodLabels[Math.round(averageMood) - 1]}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{averageEnergy.toFixed(1)}</div>
            <p className="text-sm text-slate-600">Avg. Energy</p>
            <div className="text-xs text-slate-500 mt-1">
              {energyLabels[Math.round(averageEnergy) - 1]}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {todayEntryData ? '✓' : '○'}
            </div>
            <p className="text-sm text-slate-600">Today's Entry</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Entry */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Mood Entry</CardTitle>
              <CardDescription>
                {todayEntryData ? 'Update your mood for today' : 'Record your mood for today'}
              </CardDescription>
            </div>
            <Button onClick={() => setShowEntryForm(!showEntryForm)}>
              {todayEntryData ? 'Update Entry' : 'Add Entry'}
            </Button>
          </div>
        </CardHeader>
        
        {showEntryForm && (
          <CardContent className="space-y-6">
            {/* Mood Rating */}
            <div>
              <Label className="text-base font-medium">How are you feeling today?</Label>
              <div className="flex justify-between mt-3">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    onClick={() => setTodayEntry({ ...todayEntry, mood: level })}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                      todayEntry.mood === level 
                        ? 'bg-blue-100 border-2 border-blue-500' 
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <span className="text-2xl mb-1">{moodEmojis[level - 1]}</span>
                    <span className="text-xs text-slate-600">{moodLabels[level - 1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Rating */}
            <div>
              <Label className="text-base font-medium">Energy Level</Label>
              <div className="flex justify-between mt-3">
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    onClick={() => setTodayEntry({ ...todayEntry, energy: level })}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                      todayEntry.energy === level 
                        ? 'bg-green-100 border-2 border-green-500' 
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <Activity className={`h-6 w-6 mb-1 ${
                      todayEntry.energy === level ? 'text-green-600' : 'text-slate-400'
                    }`} />
                    <span className="text-xs text-slate-600">{energyLabels[level - 1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div>
              <Label className="text-base font-medium">Activities Today</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-3">
                {activities.map(activity => (
                  <button
                    key={activity}
                    onClick={() => toggleActivity(activity)}
                    className={`p-2 rounded-md text-sm transition-all ${
                      todayEntry.activities?.includes(activity)
                        ? 'bg-purple-100 text-purple-800 border-2 border-purple-500'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="mood-notes">Notes (Optional)</Label>
              <Textarea
                id="mood-notes"
                value={todayEntry.notes}
                onChange={(e) => setTodayEntry({ ...todayEntry, notes: e.target.value })}
                placeholder="How was your day? Any specific events or feelings?"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEntryForm(false)}>
                Cancel
              </Button>
              <Button onClick={addMoodEntry}>
                {todayEntryData ? 'Update Entry' : 'Save Entry'}
              </Button>
            </div>
          </CardContent>
        )}

        {/* Show today's entry if exists */}
        {todayEntryData && !showEntryForm && (
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">{moodEmojis[todayEntryData.mood - 1]}</span>
                <div>
                  <div className="font-medium">{moodLabels[todayEntryData.mood - 1]}</div>
                  <div className="text-sm text-slate-600">Energy: {energyLabels[todayEntryData.energy - 1]}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600">Today</div>
                <div className="text-xs text-slate-500">{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Recent Entries */}
      {moodEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Mood History</CardTitle>
            <CardDescription>Your mood patterns over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {moodEntries.slice(-7).reverse().map(entry => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{moodEmojis[entry.mood - 1]}</span>
                    <div>
                      <div className="font-medium">{moodLabels[entry.mood - 1]}</div>
                      <div className="text-sm text-slate-600">
                        Energy: {energyLabels[entry.energy - 1]}
                      </div>
                      {entry.activities.length > 0 && (
                        <div className="text-xs text-slate-500">
                          Activities: {entry.activities.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                    {entry.notes && (
                      <div className="text-xs text-slate-500 max-w-xs truncate">
                        {entry.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      {moodEntries.length >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Mood Insights
            </CardTitle>
            <CardDescription>Based on your mood tracking data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Mood Pattern</h4>
                <p className="text-sm text-blue-700">
                  Your average mood is {averageMood.toFixed(1)}/5, which indicates a 
                  {averageMood > 3.5 ? ' positive' : averageMood > 2.5 ? ' neutral' : ' challenging'} 
                  overall emotional state.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Energy Level</h4>
                <p className="text-sm text-green-700">
                  Your average energy is {averageEnergy.toFixed(1)}/5. Consider 
                  {averageEnergy < 3 ? ' increasing physical activity' : ' maintaining your current routine'} 
                  to optimize your energy levels.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 