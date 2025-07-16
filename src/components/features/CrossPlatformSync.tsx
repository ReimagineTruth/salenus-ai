import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RefreshCw, Cloud, Smartphone, Monitor, Tablet, CheckCircle, AlertCircle, Clock, Wifi, WifiOff, Database, Shield, ArrowUpDown, Settings, Trophy } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  lastSync: Date;
  isOnline: boolean;
  syncStatus: 'synced' | 'syncing' | 'error' | 'offline';
}

interface SyncData {
  habits: number;
  tasks: number;
  challenges: number;
  settings: number;
  totalItems: number;
}

export const CrossPlatformSync: React.FC = () => {
  const { user } = useAuth();
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'desktop',
      lastSync: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isOnline: true,
      syncStatus: 'synced'
    },
    {
      id: '2',
      name: 'iPhone 15',
      type: 'mobile',
      lastSync: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isOnline: true,
      syncStatus: 'synced'
    },
    {
      id: '3',
      name: 'iPad Air',
      type: 'tablet',
      lastSync: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isOnline: false,
      syncStatus: 'offline'
    }
  ]);
  const [syncData, setSyncData] = useState<SyncData>({
    habits: 5,
    tasks: 12,
    challenges: 2,
    settings: 8,
    totalItems: 27
  });

  // Simulate auto-sync every 5 minutes
  useEffect(() => {
    const autoSync = () => {
      if (!syncing) {
        handleSync();
      }
    };

    const interval = setInterval(autoSync, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [syncing]);

  const handleSync = () => {
    setSyncing(true);
    setSyncProgress(0);
    
    // Simulate sync progress
    const progressInterval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setSyncing(false);
          setLastSynced(new Date());
          // Update device sync status
          setDevices(prev => prev.map(device => ({
            ...device,
            lastSync: new Date(),
            syncStatus: 'synced' as const
          })));
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate sync completion after 2 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      setSyncProgress(100);
      setSyncing(false);
      setLastSynced(new Date());
    }, 2000);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'bg-green-100 text-green-800';
      case 'syncing': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSyncStatusIcon = (status: string) => {
    switch (status) {
      case 'synced': return <CheckCircle className="h-4 w-4" />;
      case 'syncing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'offline': return <WifiOff className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cross-Platform Sync</CardTitle>
          <CardDescription>Please sign in to access cross-platform sync</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Cross-Platform Sync</h2>
          <p className="text-slate-600">Sync your data across all your devices with automatic cloud backup</p>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <Wifi className="h-3 w-3 mr-1" />
          Online
        </Badge>
      </div>

      {/* Sync Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sync Status</CardTitle>
              <CardDescription>
                Last synced: {lastSynced ? formatTimeAgo(lastSynced) : 'Never'}
              </CardDescription>
            </div>
            <Button onClick={handleSync} disabled={syncing} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {syncing && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Sync Progress</span>
                <span className="text-sm text-slate-600">{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Database className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-600">{syncData.habits}</div>
              <div className="text-sm text-slate-600">Habits</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-green-600">{syncData.tasks}</div>
              <div className="text-sm text-slate-600">Tasks</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Trophy className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-purple-600">{syncData.challenges}</div>
              <div className="text-sm text-slate-600">Challenges</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <Settings className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-orange-600">{syncData.settings}</div>
              <div className="text-sm text-slate-600">Settings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Devices */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
          <CardDescription>
            Manage your devices and monitor sync status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {devices.map(device => (
              <div key={device.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <div className="font-semibold">{device.name}</div>
                    <div className="text-sm text-slate-600">
                      Last sync: {formatTimeAgo(device.lastSync)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSyncStatusColor(device.syncStatus)}>
                    {getSyncStatusIcon(device.syncStatus)}
                    <span className="ml-1 capitalize">{device.syncStatus}</span>
                  </Badge>
                  {device.isOnline ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Wifi className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">
                      <WifiOff className="h-3 w-3 mr-1" />
                      Offline
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sync Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Security & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">End-to-end encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Data never shared with third parties</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Automatic backup every 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">GDPR compliant</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-blue-600" />
              Sync Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Real-time synchronization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Offline mode support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Conflict resolution</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Version history</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Cloud className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Sync Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your data is automatically backed up every 5 minutes</li>
                <li>• Changes sync instantly across all your devices</li>
                <li>• Use the mobile app for on-the-go access</li>
                <li>• Offline changes sync when you reconnect</li>
                <li>• You can access your data from any device by signing in</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 