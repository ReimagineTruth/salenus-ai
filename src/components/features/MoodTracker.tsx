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
  Activity,
  TrendingDown,
  Minus
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

const moods = [
  { name: 'Excellent', emoji: '😄', color: 'bg-green-100 text-green-800', value: 5 },
  { name: 'Good', emoji: '🙂', color: 'bg-blue-100 text-blue-800', value: 4 },
  { name: 'Okay', emoji: '😐', color: 'bg-yellow-100 text-yellow-800', value: 3 },
  { name: 'Bad', emoji: '😔', color: 'bg-orange-100 text-orange-800', value: 2 },
  { name: 'Terrible', emoji: '😢', color: 'bg-red-100 text-red-800', value: 1 },
];

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
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodHistory, setMoodHistory] = useState<Array<{ date: string; mood: number; note: string }>>([
    { date: '2024-01-15', mood: 4, note: 'Had a productive day' },
    { date: '2024-01-14', mood: 3, note: 'Feeling a bit tired' },
    { date: '2024-01-13', mood: 5, note: 'Amazing workout session' },
    { date: '2024-01-12', mood: 2, note: 'Stressful work day' },
    { date: '2024-01-11', mood: 4, note: 'Good progress on goals' },
  ]);

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

  const handleMoodSelect = (moodValue: number) => {
    setSelectedMood(moodValue);
  };

  const handleSaveMood = () => {
    if (selectedMood !== null) {
      const today = new Date().toISOString().split('T')[0];
      const newEntry = {
        date: today,
        mood: selectedMood,
        note: 'Tracked via mood tracker'
      };
      setMoodHistory([newEntry, ...moodHistory]);
      setSelectedMood(null);
    }
  };

  const getMoodTrend = () => {
    if (moodHistory.length < 2) return 'stable';
    const recent = moodHistory.slice(0, 3).reduce((sum, entry) => sum + entry.mood, 0) / 3;
    const older = moodHistory.slice(3, 6).reduce((sum, entry) => sum + entry.mood, 0) / 3;
    if (recent > older) return 'improving';
    if (recent < older) return 'declining';
    return 'stable';
  };

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
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mood Tracker</h1>
          <p className="text-gray-600 mt-2">Track your daily mood and get personalized insights</p>
        </div>
        <Badge className="bg-indigo-100 text-indigo-800">Pro Feature</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Mood Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Today's Mood
            </CardTitle>
            <CardDescription>How are you feeling today?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedMood === mood.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs font-medium">{mood.name}</div>
                </button>
              ))}
            </div>
            <Button 
              onClick={handleSaveMood} 
              disabled={selectedMood === null}
              className="w-full"
            >
              Save Mood
            </Button>
          </CardContent>
        </Card>

        {/* Mood Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Mood Statistics</CardTitle>
            <CardDescription>Your mood patterns and trends</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Mood</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-indigo-600">
                  {averageMood.toFixed(1)}
                </span>
                <span className="text-lg">
                  {moods.find(m => Math.round(m.value) === Math.round(averageMood))?.emoji}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Trend</span>
              <div className="flex items-center gap-2">
                {getMoodTrend() === 'improving' && <TrendingUp className="h-4 w-4 text-green-500" />}
                {getMoodTrend() === 'declining' && <TrendingDown className="h-4 w-4 text-red-500" />}
                {getMoodTrend() === 'stable' && <Minus className="h-4 w-4 text-gray-500" />}
                <span className="text-sm font-medium capitalize">{getMoodTrend()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Days Tracked</span>
              <span className="text-lg font-bold text-gray-900">{moodHistory.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Mood Insights */}
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>Personalized recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Mood Pattern Detected</h4>
              <p className="text-sm text-blue-700">
                You tend to feel better on days when you exercise. Consider adding a morning workout to your routine.
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Positive Trend</h4>
              <p className="text-sm text-green-700">
                Your mood has improved by 15% this week compared to last week. Keep up the great work!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mood History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Mood History
          </CardTitle>
          <CardDescription>Your mood tracking over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {moodHistory.slice(0, 10).map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {moods.find(m => m.value === entry.mood)?.emoji}
                  </span>
                  <div>
                    <div className="font-medium">
                      {moods.find(m => m.value === entry.mood)?.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 max-w-xs truncate">
                  {entry.note}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 