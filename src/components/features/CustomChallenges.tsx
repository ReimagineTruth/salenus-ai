import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Lock, ArrowUp } from 'lucide-react';

export const CustomChallenges: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  if (!user) return null;
  if (!hasFeature('custom_challenges')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Custom Challenges</h3>
          <p className="text-slate-500 mb-4">Create private challenges for friends and track group progress.</p>
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
          <h2 className="text-2xl font-bold text-slate-800">Custom Challenges</h2>
          <p className="text-slate-600">Create private challenges for friends and track group progress.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Challenges</CardTitle>
          <CardDescription>Manage your custom challenges here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-slate-600">(Mocked) Create, join, and manage private challenges for your group.</div>
        </CardContent>
      </Card>
    </div>
  );
}; 