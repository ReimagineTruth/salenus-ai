import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';

export const BasicNotifications: React.FC = () => {
  const [habitReminders, setHabitReminders] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Notifications</CardTitle>
        <CardDescription>
          Simple push notifications for habit reminders and task deadlines.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-6 w-6 text-blue-600" />
          <span className="text-slate-700 font-medium">Notification Settings</span>
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-center gap-3">
            <Switch checked={habitReminders} onCheckedChange={setHabitReminders} />
            <span>Habit Reminders</span>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={taskReminders} onCheckedChange={setTaskReminders} />
            <span>Task Reminders</span>
          </div>
        </div>
        <div className="text-sm text-slate-600">
          Enable or disable reminders for your daily habits and tasks.<br />
          <span className="text-blue-600 font-medium">Note:</span> This is a demo. Real notifications require app permissions.
        </div>
      </CardContent>
    </Card>
  );
}; 