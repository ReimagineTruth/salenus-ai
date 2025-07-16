import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Lock, ArrowUp, Calendar, Plus, CheckCircle, Clock, Link2, ExternalLink } from 'lucide-react';

export const CalendarIntegration: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  if (!user) return null;
  if (!hasFeature('calendar_integration')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Calendar Integration</h3>
          <p className="text-slate-500 mb-4">Sync your habits and tasks with Google, Apple, or Outlook calendars.</p>
          <Button onClick={onUpgrade} className="bg-purple-600 hover:bg-purple-700">
            <ArrowUp className="h-4 w-4 mr-2" />Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Calendar Integration</h2>
          <p className="text-slate-600">Sync your habits and tasks with your favorite calendar apps.</p>
        </div>
        <Badge className="bg-purple-100 text-purple-700">Premium</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Connect Your Calendar</CardTitle>
          <CardDescription>Choose a provider to sync your events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Button variant="outline" className="flex-1 flex items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Google_Calendar_icon_%282020%29.svg" alt="Google" className="h-5 w-5" />
              Google Calendar
              <Link2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex-1 flex items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Apple_Calendar_icon.png" alt="Apple" className="h-5 w-5" />
              Apple Calendar
              <Link2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex-1 flex items-center gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Microsoft_Office_Outlook_%282018–present%29.svg" alt="Outlook" className="h-5 w-5" />
              Outlook
              <Link2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Synced Events</CardTitle>
          <CardDescription>See your next 3 synced events</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Morning Routine - 7:00 AM (Google Calendar)</span>
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <span>Weekly Review - Sunday 6:00 PM (Apple Calendar)</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-purple-500" />
              <span>Monthly Goal Check-in - 1st of Month (Outlook)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Schedule a New Habit</CardTitle>
          <CardDescription>Add a habit or task to your calendar</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col md:flex-row gap-4">
            <input type="text" placeholder="Habit/Task Name" className="border p-2 rounded-md flex-1" />
            <input type="datetime-local" className="border p-2 rounded-md flex-1" />
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add to Calendar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 