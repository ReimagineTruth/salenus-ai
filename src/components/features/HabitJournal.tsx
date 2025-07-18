import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Key, BookOpen, Star, TrendingUp, Lightbulb, ArrowUp, Plus, Calendar, Edit, Trash } from 'lucide-react';

export const HabitJournal: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  const [entries, setEntries] = useState([
    {
      id: 1,
      date: '2024-01-15',
      template: 'Daily Reflection',
      content: 'Today I completed my morning routine successfully. I felt more energized throughout the day. The meditation session helped me stay focused during work.',
      mood: 8,
      habits: ['morning_routine', 'meditation'],
      tags: ['productive', 'energized'],
      insights: 'Morning routine consistency is improving mood and productivity'
    },
    {
      id: 2,
      date: '2024-01-14',
      template: 'Weekly Review',
      content: 'This week I maintained my exercise habit for 5 out of 7 days. I noticed that on days when I exercised, my mood was significantly better. Need to work on consistency.',
      mood: 7,
      habits: ['exercise', 'mood_tracking'],
      tags: ['weekly_review', 'exercise'],
      insights: 'Exercise has strong correlation with mood improvement'
    },
    {
      id: 3,
      date: '2024-01-13',
      template: 'Habit Challenge',
      content: 'Tried a new habit today - reading for 30 minutes before bed. It was challenging to start but felt rewarding. Will continue tomorrow.',
      mood: 6,
      habits: ['reading'],
      tags: ['new_habit', 'challenge'],
      insights: 'New habits require initial effort but provide satisfaction'
    }
  ]);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('Daily Reflection');
  const [newEntry, setNewEntry] = useState({
    content: '',
    mood: 5,
    habits: [],
    tags: []
  });

  const templates = [
    {
      name: 'Daily Reflection',
      description: 'Reflect on your day and how your habits affected you',
      prompts: [
        'What habits did you practice today?',
        'How did you feel throughout the day?',
        'What challenges did you face?',
        'What would you do differently tomorrow?'
      ]
    },
    {
      name: 'Weekly Review',
      description: 'Review your week and identify patterns',
      prompts: [
        'Which habits were most successful this week?',
        'What patterns did you notice?',
        'What goals did you achieve?',
        'What will you focus on next week?'
      ]
    },
    {
      name: 'Habit Challenge',
      description: 'Document a new habit or challenge',
      prompts: [
        'What new habit are you trying?',
        'What motivated you to start this habit?',
        'What obstacles did you encounter?',
        'How will you overcome these obstacles?'
      ]
    },
    {
      name: 'Mood Analysis',
      description: 'Analyze the connection between habits and mood',
      prompts: [
        'How was your overall mood today?',
        'Which habits positively affected your mood?',
        'Which habits negatively affected your mood?',
        'What can you learn from this?'
      ]
    }
  ];

  if (!user) return null;
  if (!hasFeature('habit_journal')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Habit Journal</h3>
          <p className="text-slate-500 mb-4">Advanced journaling with templates and reflection prompts.</p>
          <Button onClick={onUpgrade} className="bg-indigo-600 hover:bg-indigo-700">
            <ArrowUp className="h-4 w-4 mr-2" />Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    );
  }

  const addEntry = () => {
    if (newEntry.content) {
      const entry = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        template: selectedTemplate,
        ...newEntry
      };
      setEntries([entry, ...entries]);
      setNewEntry({ content: '', mood: 5, habits: [], tags: [] });
      setShowNewEntry(false);
    }
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'text-green-600';
    if (mood >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return '😊';
    if (mood >= 6) return '😐';
    return '😔';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Habit Journal</h2>
          <p className="text-slate-600">Advanced journaling with templates, tags, and reflection prompts.</p>
        </div>
        <Badge className="bg-indigo-100 text-indigo-700">Pro</Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Entries</p>
                <p className="text-2xl font-bold text-slate-900">{entries.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Avg Mood</p>
                <p className="text-2xl font-bold text-slate-900">
                  {(entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length).toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Streak</p>
                <p className="text-2xl font-bold text-slate-900">5 days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Insights</p>
                <p className="text-2xl font-bold text-slate-900">12</p>
              </div>
              <Lightbulb className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Entry Button */}
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowNewEntry(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          New Journal Entry
        </Button>
      </div>

      {/* New Entry Modal */}
      {showNewEntry && (
        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <CardTitle>New Journal Entry</CardTitle>
            <CardDescription>Choose a template and reflect on your habits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Template Selection */}
            <div>
              <label className="text-sm font-medium">Template</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md mt-1"
              >
                {templates.map((template) => (
                  <option key={template.name} value={template.name}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Template Prompts */}
            <div>
              <label className="text-sm font-medium">Reflection Prompts</label>
              <div className="mt-2 p-3 bg-slate-50 rounded-lg">
                {templates.find(t => t.name === selectedTemplate)?.prompts.map((prompt, index) => (
                  <div key={index} className="text-sm text-slate-600 mb-1">
                    • {prompt}
                  </div>
                ))}
              </div>
            </div>

            {/* Journal Content */}
            <div>
              <label className="text-sm font-medium">Your Reflection</label>
              <Textarea
                value={newEntry.content}
                onChange={(e) => setNewEntry({...newEntry, content: e.target.value})}
                placeholder="Write your reflection here..."
                rows={6}
              />
            </div>

            {/* Mood Rating */}
            <div>
              <label className="text-sm font-medium">How was your mood today?</label>
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-slate-600">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newEntry.mood}
                  onChange={(e) => setNewEntry({...newEntry, mood: parseInt(e.target.value)})}
                  className="flex-1"
                />
                <span className="text-sm text-slate-600">10</span>
                <span className={`font-semibold ${getMoodColor(newEntry.mood)}`}>
                  {newEntry.mood} {getMoodEmoji(newEntry.mood)}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={addEntry} className="bg-indigo-600 hover:bg-indigo-700">
                Save Entry
              </Button>
              <Button variant="outline" onClick={() => setShowNewEntry(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Journal Entries */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent Entries</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <BookOpen className="h-5 w-5 text-indigo-600" />
                      <h3 className="text-lg font-semibold">{entry.template}</h3>
                      <Badge variant="outline">{entry.template}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4" />
                        <span className={getMoodColor(entry.mood)}>
                          Mood: {entry.mood}/10 {getMoodEmoji(entry.mood)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-slate-700 mb-4">{entry.content}</p>
                </div>
                
                {/* Tags */}
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* AI Insight */}
                {entry.insights && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">AI Insight</p>
                        <p className="text-sm text-blue-700">{entry.insights}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <Card key={template.name} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                    <span>{template.name}</span>
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {template.prompts.map((prompt, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-slate-600">{prompt}</p>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => {
                      setSelectedTemplate(template.name);
                      setShowNewEntry(true);
                    }}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>Patterns and correlations discovered from your journal entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">🎯 Habit-Mood Correlation</h4>
                  <p className="text-sm text-green-700">Your mood is 23% higher on days when you complete your morning routine.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">📈 Consistency Trend</h4>
                  <p className="text-sm text-blue-700">Your journaling habit has improved by 15% over the last month.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">💡 Reflection Quality</h4>
                  <p className="text-sm text-purple-700">Your entries show deeper self-awareness when using the "Weekly Review" template.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 
