import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Key, ArrowUp, Calendar, Plus, Edit, X, Save, Settings, Link2, Trash2 } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  calendar: 'google' | 'apple' | 'outlook';
  reminder: boolean;
  reminderTime: string;
}

export const CalendarIntegration: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  const [connectedCalendars, setConnectedCalendars] = useState<{google: boolean, apple: boolean, outlook: boolean}>({
    google: false,
    apple: false,
    outlook: false
  });
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Morning Routine',
      description: 'Daily habit check-in and planning',
      date: '2024-01-15',
      time: '07:00',
      calendar: 'google',
      reminder: true,
      reminderTime: '06:45'
    },
    {
      id: '2',
      title: 'Weekly Review',
      description: 'Review progress and set new goals',
      date: '2024-01-21',
      time: '18:00',
      calendar: 'apple',
      reminder: true,
      reminderTime: '17:45'
    },
    {
      id: '3',
      title: 'Monthly Goal Check-in',
      description: 'Monthly habit and goal assessment',
      date: '2024-02-01',
      time: '19:00',
      calendar: 'outlook',
      reminder: true,
      reminderTime: '18:30'
    }
  ]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    date: '',
    time: '',
    calendar: 'google',
    reminder: true,
    reminderTime: ''
  });

  if (!user) return null;
  if (!hasFeature('calendar_integration')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Calendar Integration</h3>
          <p className="text-slate-500 mb-4">Sync your habits and tasks with Google, Apple, or Outlook calendars.</p>
          <Button onClick={onUpgrade} className="bg-purple-600 hover:bg-purple-700">
            <ArrowUp className="h-4 w-4 mr-2" />Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    );
  }

  const connectCalendar = (provider: 'google' | 'apple' | 'outlook') => {
    setConnectedCalendars(prev => ({ ...prev, [provider]: true }));
    // In a real app, this would open OAuth flow
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} Calendar connected successfully!`);
  };

  const disconnectCalendar = (provider: 'google' | 'apple' | 'outlook') => {
    setConnectedCalendars(prev => ({ ...prev, [provider]: false }));
    alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} Calendar disconnected.`);
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;
    
    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title!,
      description: newEvent.description || '',
      date: newEvent.date!,
      time: newEvent.time!,
      calendar: newEvent.calendar || 'google',
      reminder: newEvent.reminder || false,
      reminderTime: newEvent.reminderTime || ''
    };
    
    setEvents([...events, event]);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      calendar: 'google',
      reminder: true,
      reminderTime: ''
    });
    setShowAddEvent(false);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const getCalendarIcon = (provider: string) => {
    switch (provider) {
      case 'google': return '📅';
      case 'apple': return '🍎';
      case 'outlook': return '📧';
      default: return '📅';
    }
  };

  const getCalendarName = (provider: string) => {
    switch (provider) {
      case 'google': return 'Google Calendar';
      case 'apple': return 'Apple Calendar';
      case 'outlook': return 'Outlook';
      default: return 'Calendar';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Calendar Integration</h2>
          <p className="text-slate-600">Sync your habits and tasks with your favorite calendar apps.</p>
        </div>
        <Badge className="bg-purple-100 text-purple-700">Premium</Badge>
      </div>

      {/* Connected Calendars */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-blue-500" />
            Connected Calendars
          </CardTitle>
          <CardDescription>Manage your calendar connections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📅</span>
                <div>
                  <h4 className="font-medium">Google Calendar</h4>
                  <p className="text-sm text-gray-500">
                    {connectedCalendars.google ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Button
                variant={connectedCalendars.google ? "destructive" : "default"}
                size="sm"
                onClick={() => connectedCalendars.google ? disconnectCalendar('google') : connectCalendar('google')}
              >
                {connectedCalendars.google ? 'Disconnect' : 'Connect'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍎</span>
                <div>
                  <h4 className="font-medium">Apple Calendar</h4>
                  <p className="text-sm text-gray-500">
                    {connectedCalendars.apple ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Button
                variant={connectedCalendars.apple ? "destructive" : "default"}
                size="sm"
                onClick={() => connectedCalendars.apple ? disconnectCalendar('apple') : connectCalendar('apple')}
              >
                {connectedCalendars.apple ? 'Disconnect' : 'Connect'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📧</span>
                <div>
                  <h4 className="font-medium">Outlook</h4>
                  <p className="text-sm text-gray-500">
                    {connectedCalendars.outlook ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Button
                variant={connectedCalendars.outlook ? "destructive" : "default"}
                size="sm"
                onClick={() => connectedCalendars.outlook ? disconnectCalendar('outlook') : connectCalendar('outlook')}
              >
                {connectedCalendars.outlook ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                Synced Events
              </CardTitle>
              <CardDescription>Your calendar events synced from Salenus AI</CardDescription>
            </div>
            <Button onClick={() => setShowAddEvent(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getCalendarIcon(event.calendar)}</span>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-gray-500">
                        📅 {new Date(event.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-500">
                        🕐 {event.time}
                      </span>
                      <span className="text-xs text-gray-500">
                        {getCalendarName(event.calendar)}
                      </span>
                      {event.reminder && (
                        <span className="text-xs text-blue-500">
                          🔔 Reminder: {event.reminderTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => deleteEvent(event.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Event Modal */}
      {showAddEvent && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Calendar Event</CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAddEvent(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Event Title</Label>
                <Input
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Enter event title"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Enter event description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label>Calendar</Label>
                <Select 
                  value={newEvent.calendar} 
                  onValueChange={(value) => setNewEvent({...newEvent, calendar: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google Calendar</SelectItem>
                    <SelectItem value="apple">Apple Calendar</SelectItem>
                    <SelectItem value="outlook">Outlook</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newEvent.reminder}
                  onCheckedChange={(checked) => setNewEvent({...newEvent, reminder: checked})}
                />
                <Label>Set Reminder</Label>
              </div>
              {newEvent.reminder && (
                <div>
                  <Label>Reminder Time</Label>
                  <Input
                    type="time"
                    value={newEvent.reminderTime}
                    onChange={(e) => setNewEvent({...newEvent, reminderTime: e.target.value})}
                  />
                </div>
              )}
              <div className="flex gap-2">
                <Button onClick={addEvent} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
                <Button variant="outline" onClick={() => setShowAddEvent(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-500" />
            Sync Settings
          </CardTitle>
          <CardDescription>Configure your calendar sync preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-sync habits to calendar</Label>
              <p className="text-sm text-gray-500">Automatically create calendar events for your habits</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Sync task deadlines</Label>
              <p className="text-sm text-gray-500">Add task deadlines to your calendar</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Include progress reminders</Label>
              <p className="text-sm text-gray-500">Send calendar reminders for progress check-ins</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
