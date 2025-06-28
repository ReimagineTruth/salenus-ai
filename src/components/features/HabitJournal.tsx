import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Lock, ArrowUp } from 'lucide-react';

export const HabitJournal: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  if (!user) return null;
  if (!hasFeature('habit_journal')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Habit Journal</h3>
          <p className="text-slate-500 mb-4">Advanced journaling with templates, tags, and reflection prompts.</p>
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
          <h2 className="text-2xl font-bold text-slate-800">Habit Journal</h2>
          <p className="text-slate-600">Advanced journaling with templates, tags, and reflection prompts.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Journal</CardTitle>
          <CardDescription>Write and reflect on your habits here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-slate-600">(Mocked) Add, edit, and review your habit journal entries.</div>
        </CardContent>
      </Card>
    </div>
  );
}; 