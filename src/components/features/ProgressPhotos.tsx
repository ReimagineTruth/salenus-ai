import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Lock, ArrowUp } from 'lucide-react';

export const ProgressPhotos: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  if (!user) return null;
  if (!hasFeature('progress_photos')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Progress Photos</h3>
          <p className="text-slate-500 mb-4">Document your journey with progress photos and visual habit tracking.</p>
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
          <h2 className="text-2xl font-bold text-slate-800">Progress Photos</h2>
          <p className="text-slate-600">Document your journey with progress photos and visual habit tracking.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Photos</CardTitle>
          <CardDescription>Upload and view your progress photos here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-slate-600">(Mocked) Upload, view, and compare your progress photos over time.</div>
        </CardContent>
      </Card>
    </div>
  );
}; 