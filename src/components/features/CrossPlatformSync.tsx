import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Cloud } from 'lucide-react';

export const CrossPlatformSync: React.FC = () => {
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setLastSynced(new Date());
      setSyncing(false);
    }, 1200);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cross-Platform Sync</CardTitle>
        <CardDescription>
          Sync your data across all your devices with automatic cloud backup.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Cloud className="h-6 w-6 text-blue-600" />
          <span className="text-slate-700 font-medium">Cloud Sync Status</span>
        </div>
        <div className="mb-4">
          <span className="font-medium">Last synced:</span>{' '}
          {lastSynced ? lastSynced.toLocaleString() : 'Never'}
        </div>
        <Button onClick={handleSync} disabled={syncing} className="mb-4">
          <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </Button>
        <div className="text-sm text-slate-600">
          Your data is automatically backed up and available on any device where you sign in.<br />
          <span className="text-blue-600 font-medium">Pro tip:</span> Use the mobile app for on-the-go access!
        </div>
      </CardContent>
    </Card>
  );
} 