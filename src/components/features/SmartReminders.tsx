import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Lock, ArrowUp } from 'lucide-react';

export const SmartReminders: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  if (!user) return null;
  if (!hasFeature('smart_reminders')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Smart Reminders</h3>
          <p className="text-slate-500 mb-4">AI-powered reminders that adapt to your schedule and productivity times.</p>
          <Button onClick={onUpgrade} className="bg-indigo-600 hover:bg-indigo-700">
            <ArrowUp className="h-4 w-4 mr-2" />Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Smart Reminders</h2>
          <p className="text-slate-600">AI-powered reminders that adapt to your schedule and productivity times.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Reminders</CardTitle>
          <CardDescription>Set and manage your smart reminders here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-slate-600">(Mocked) You can add, edit, and delete reminders. AI will optimize timing based on your habits.</div>
        </CardContent>
      </Card>
    </div>
  );
}; 