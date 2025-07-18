import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Key, Clock, ArrowUp, Bell, Zap, Calendar, CheckCircle, Plus, Edit, Trash } from 'lucide-react';

export const SmartReminders: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: 'Morning Meditation',
      description: 'Start your day with 10 minutes of meditation',
      time: '07:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      type: 'habit',
      status: 'active',
      aiOptimized: true,
      lastTriggered: '2024-01-15'
    },
    {
      id: 2,
      title: 'Take Medication',
      description: 'Don\'t forget your daily medication',
      time: '09:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      type: 'health',
      status: 'active',
      aiOptimized: false,
      lastTriggered: '2024-01-15'
    },
    {
      id: 3,
      title: 'Evening Exercise',
      description: 'Complete your daily workout routine',
      time: '18:30',
      days: ['Monday', 'Wednesday', 'Friday'],
      type: 'fitness',
      status: 'active',
      aiOptimized: true,
      lastTriggered: '2024-01-14'
    }
  ]);
  const [showCreate, setShowCreate] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    time: '09:00',
    days: [],
    type: 'general',
    aiOptimized: true
  });

  if (!user) return null;
  if (!hasFeature('smart_reminders')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Smart Reminders</h3>
          <p className="text-slate-500 mb-4">AI-powered reminders that adapt to your schedule and productivity times.</p>
          <Button onClick={onUpgrade} className="bg-indigo-600 hover:bg-indigo-700">
            <ArrowUp className="h-4 w-4 mr-2" />Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    );
  }

  const createReminder = () => {
    if (newReminder.title && newReminder.description) {
      const reminder = {
        id: Date.now(),
        ...newReminder,
        status: 'active',
        lastTriggered: new Date().toISOString().split('T')[0]
      };
      setReminders([reminder, ...reminders]);
      setNewReminder({ title: '', description: '', time: '09:00', days: [], type: 'general', aiOptimized: true });
      setShowCreate(false);
    }
  };

  const toggleReminder = (id: number) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, status: reminder.status === 'active' ? 'paused' : 'active' }
        : reminder
    ));
  };

  const deleteReminder = (id: number) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'habit': return 'bg-blue-100 text-blue-700';
      case 'health': return 'bg-red-100 text-red-700';
      case 'fitness': return 'bg-green-100 text-green-700';
      case 'work': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const reminderTypes = ['general', 'habit', 'health', 'fitness', 'work'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Smart Reminders</h2>
          <p className="text-slate-600">AI-powered reminders that adapt to your schedule and productivity times.</p>
        </div>
        <Badge className="bg-indigo-100 text-indigo-700">Pro</Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Reminders</p>
                <p className="text-2xl font-bold text-slate-900">{reminders.filter(r => r.status === 'active').length}</p>
              </div>
              <Bell className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">AI Optimized</p>
                <p className="text-2xl font-bold text-slate-900">{reminders.filter(r => r.aiOptimized).length}</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Today's Reminders</p>
                <p className="text-2xl font-bold text-slate-900">5</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Response Rate</p>
                <p className="text-2xl font-bold text-slate-900">87%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Reminder Button */}
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowCreate(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Smart Reminder
        </Button>
      </div>

      {/* Create Reminder Modal */}
      {showCreate && (
        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <CardTitle>Create Smart Reminder</CardTitle>
            <CardDescription>Set up an AI-optimized reminder</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Reminder Title</label>
                <Input
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  placeholder="e.g., Morning Meditation"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Type</label>
                <select
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({...newReminder, type: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  {reminderTypes.map((type) => (
                    <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newReminder.description}
                onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                placeholder="Describe what you need to be reminded about..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Time</label>
                <Input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Days</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const updatedDays = newReminder.days.includes(day)
                          ? newReminder.days.filter(d => d !== day)
                          : [...newReminder.days, day];
                        setNewReminder({...newReminder, days: updatedDays});
                      }}
                      className={`px-2 py-1 text-xs rounded ${
                        newReminder.days.includes(day)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="aiOptimized"
                checked={newReminder.aiOptimized}
                onChange={(e) => setNewReminder({...newReminder, aiOptimized: e.target.checked})}
                className="rounded"
              />
              <label htmlFor="aiOptimized" className="text-sm">AI Optimized (adapts to your schedule)</label>
            </div>

            <div className="flex space-x-2">
              <Button onClick={createReminder} className="bg-indigo-600 hover:bg-indigo-700">
                Create Reminder
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reminders List */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="ai">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reminders.filter(r => r.status === 'active').map((reminder) => (
              <Card key={reminder.id} className="border-l-4 border-l-indigo-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Bell className="h-5 w-5 text-indigo-600" />
                        <h3 className="text-lg font-semibold">{reminder.title}</h3>
                        <Badge className={getTypeColor(reminder.type)}>
                          {reminder.type}
                        </Badge>
                        {reminder.aiOptimized && (
                          <Badge className="bg-yellow-100 text-yellow-700">
                            <Zap className="h-3 w-3 mr-1" />
                            AI
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-600 mb-3">{reminder.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{reminder.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{reminder.days.length} days/week</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleReminder(reminder.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteReminder(reminder.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {reminder.days.map((day) => (
                        <Badge key={day} variant="outline" className="text-xs">
                          {day.slice(0, 3)}
                        </Badge>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleReminder(reminder.id)}
                    >
                      Pause
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paused" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {reminders.filter(r => r.status === 'paused').map((reminder) => (
              <Card key={reminder.id} className="border-l-4 border-l-yellow-500 opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Bell className="h-5 w-5 text-yellow-600" />
                        <h3 className="text-lg font-semibold">{reminder.title}</h3>
                        <Badge className={getTypeColor(reminder.type)}>
                          {reminder.type}
                        </Badge>
                      </div>
                      <p className="text-slate-600 mb-3">{reminder.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => toggleReminder(reminder.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteReminder(reminder.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleReminder(reminder.id)}
                  >
                    Resume
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Optimization Insights</CardTitle>
              <CardDescription>How AI is optimizing your reminders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">🎯 Optimal Timing</h4>
                  <p className="text-sm text-blue-700">Your morning reminders are most effective between 7:00-8:00 AM based on your response patterns.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">📈 Success Rate</h4>
                  <p className="text-sm text-green-700">AI-optimized reminders have 23% higher completion rates than standard reminders.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-2">🔄 Adaptive Scheduling</h4>
                  <p className="text-sm text-purple-700">Your exercise reminders automatically adjust based on your calendar and energy levels.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 
