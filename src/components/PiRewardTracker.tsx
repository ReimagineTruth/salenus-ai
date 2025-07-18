import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Pi, 
  Play, 
  TrendingUp, 
  Calendar, 
  Target, 
  Sparkles,
  Clock,
  CheckCircle,
  ExternalLink,
  Eye,
  Users,
  Edit,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  Copy,
  Archive,
  Settings,
  Plus,
  X
} from 'lucide-react';
import { DataManagementPanel } from './DataManagementPanel';

interface AdHistory {
  id: string;
  date: string;
  adTitle: string;
  duration: number;
  type: string;
  notes?: string;
  archived?: boolean;
  archived_at?: string;
}

export const PiRewardTracker: React.FC = () => {
  const [totalAds, setTotalAds] = useState(0);
  const [todayAds, setTodayAds] = useState(0);
  const [weeklyGoal, setWeeklyGoal] = useState(5); // 5 ads per week goal
  const [adHistory, setAdHistory] = useState<AdHistory[]>([
    {
      id: '1',
      date: '2024-01-15',
      adTitle: 'Pi Network - Build Your Future',
      duration: 30,
      type: 'video'
    },
    {
      id: '2',
      date: '2024-01-14',
      adTitle: 'Pi Browser - Your Gateway to Web3',
      duration: 15,
      type: 'banner'
    },
    {
      id: '3',
      date: '2024-01-13',
      adTitle: 'Pi Apps - Discover Amazing Apps',
      duration: 20,
      type: 'interactive'
    },
    {
      id: '4',
      date: '2024-01-12',
      adTitle: 'Pi KYC - Verify Your Identity',
      duration: 25,
      type: 'video'
    },
    {
      id: '5',
      date: '2024-01-11',
      adTitle: 'Pi Node - Run a Node, Earn Rewards',
      duration: 18,
      type: 'banner'
    }
  ]);
  const [notifications, setNotifications] = useState<{id: string, title: string, message: string, time: Date}[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAd, setEditingAd] = useState<AdHistory | null>(null);
  const [editForm, setEditForm] = useState({
    adTitle: '',
    duration: 0,
    type: 'video' as const,
    notes: ''
  });

  // CRUD Operations
  const addAdEntry = (adData: Omit<AdHistory, 'id'>) => {
    const newAd: AdHistory = {
      ...adData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setAdHistory(prev => [newAd, ...prev]);
  };

  const editAdEntry = (id: string, updates: Partial<AdHistory>) => {
    setAdHistory(prev => prev.map(ad => 
      ad.id === id ? { ...ad, ...updates } : ad
    ));
  };

  // Open edit modal
  const openEditModal = (ad: AdHistory) => {
    setEditingAd(ad);
    setEditForm({
      adTitle: ad.adTitle,
      duration: ad.duration,
      type: ad.type as any,
      notes: ad.notes || ''
    });
    setShowEditModal(true);
  };

  // Save edited ad entry
  const saveEditedAd = () => {
    if (!editingAd) return;

    const updatedAd: AdHistory = {
      ...editingAd,
      adTitle: editForm.adTitle,
      duration: editForm.duration,
      type: editForm.type,
      notes: editForm.notes
    };

    editAdEntry(editingAd.id, updatedAd);
    setShowEditModal(false);
    setEditingAd(null);
  };

  const deleteAdEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this ad entry?')) {
      setAdHistory(prev => prev.filter(ad => ad.id !== id));
    }
  };

  const archiveAdEntry = (id: string) => {
    setAdHistory(prev => prev.map(ad => 
      ad.id === id ? { ...ad, archived: true, archived_at: new Date().toISOString() } : ad
    ));
  };

  const restoreAdEntry = (id: string) => {
    setAdHistory(prev => prev.map(ad => 
      ad.id === id ? { ...ad, archived: false, archived_at: undefined } : ad
    ));
  };

  const duplicateAdEntry = (id: string) => {
    const ad = adHistory.find(a => a.id === id);
    if (ad) {
      const duplicatedAd: AdHistory = {
        ...ad,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        adTitle: `${ad.adTitle} (Copy)`
      };
      setAdHistory(prev => [duplicatedAd, ...prev]);
    }
  };

  const restartData = () => {
    if (confirm('Are you sure you want to restart all Pi Network data? This will reset all progress.')) {
      setAdHistory([]);
      setTotalAds(0);
      setTodayAds(0);
    }
  };

  const exportData = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      feature: 'PiRewardTracker',
      data: {
        adHistory,
        totalAds,
        todayAds,
        weeklyGoal,
        totalWatchTime: adHistory.reduce((sum, ad) => sum + ad.duration, 0)
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pi-reward-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = async (file: File) => {
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      if (importedData.data && importedData.data.adHistory) {
        setAdHistory(importedData.data.adHistory);
        setTotalAds(importedData.data.totalAds || 0);
        setTodayAds(importedData.data.todayAds || 0);
        setWeeklyGoal(importedData.data.weeklyGoal || 5);
      }
    } catch (error) {
      console.error('Error importing Pi Network data:', error);
      throw error;
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear ALL Pi Network data? This action cannot be undone.')) {
      setAdHistory([]);
      setTotalAds(0);
      setTodayAds(0);
    }
  };

  const backupData = () => {
    // Create a backup with timestamp
    const backupData = {
      backupDate: new Date().toISOString(),
      feature: 'PiRewardTracker',
      data: {
        adHistory,
        totalAds,
        todayAds,
        weeklyGoal
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pi-reward-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareData = () => {
    const shareText = `Pi Network Integration Stats:
- Total Ads Watched: ${totalAds}
- Today's Ads: ${todayAds}
- Weekly Goal Progress: ${weeklyAds}/${weeklyGoal}
- Total Watch Time: ${adHistory.reduce((sum, ad) => sum + ad.duration, 0)} seconds`;

    if (navigator.share) {
      navigator.share({
        title: 'Pi Network Integration Stats',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Stats copied to clipboard!');
    }
  };

  useEffect(() => {
    // Calculate total ads watched
    setTotalAds(adHistory.length);

    // Calculate today's ads
    const today = new Date().toISOString().split('T')[0];
    const todayTotal = adHistory.filter(ad => ad.date === today).length;
    setTodayAds(todayTotal);
  }, [adHistory]);

  const weeklyProgress = (totalAds / weeklyGoal) * 100;
  const weeklyAds = adHistory.filter(ad => {
    const adDate = new Date(ad.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return adDate >= weekAgo;
  }).length;

  const totalWatchTime = adHistory.reduce((sum, ad) => sum + ad.duration, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pi Network Integration</h2>
          <p className="text-gray-600">Track your Pi Network ad engagement and ecosystem participation</p>
        </div>
        <Badge className="bg-yellow-100 text-yellow-800">
          <Pi className="h-4 w-4 mr-1" />
          Pi Network
        </Badge>
      </div>

      {/* Data Management Panel */}
      <DataManagementPanel
        featureName="Pi Network Integration"
        dataCount={adHistory.length}
        onExport={exportData}
        onImport={importData}
        onClearAll={clearAllData}
        onRestartData={restartData}
        onDuplicate={() => {
          if (adHistory.length > 0) {
            duplicateAdEntry(adHistory[0].id);
          }
        }}
        onArchive={() => {
          if (adHistory.length > 0) {
            archiveAdEntry(adHistory[0].id);
          }
        }}
        onRestore={() => {
          if (adHistory.length > 0) {
            restoreAdEntry(adHistory[0].id);
          }
        }}
        onShare={shareData}
        onBackup={backupData}
        hasData={adHistory.length > 0}
        canEdit={true}
        canDelete={true}
        canArchive={true}
        canShare={true}
        canBackup={true}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Ads Watched */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-500" />
              Ads Watched
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {totalAds}
            </div>
            <p className="text-sm text-gray-600">Total Pi Network ads</p>
          </CardContent>
        </Card>

        {/* Today's Ads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Today's Ads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {todayAds}
            </div>
            <p className="text-sm text-gray-600">Ads watched today</p>
          </CardContent>
        </Card>

        {/* Weekly Goal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Weekly Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {weeklyAds} / {weeklyGoal}
            </div>
            <Progress value={Math.min(weeklyProgress, 100)} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              {Math.round(weeklyProgress)}% of weekly goal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            Engagement Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{totalWatchTime}</div>
              <p className="text-sm text-gray-600">Total Watch Time (sec)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalAds > 0 ? Math.round(totalWatchTime / totalAds) : 0}
              </div>
              <p className="text-sm text-gray-600">Avg. Duration (sec)</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {adHistory.filter(ad => ad.type === 'video').length}
              </div>
              <p className="text-sm text-gray-600">Video Ads</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {adHistory.filter(ad => ad.date === new Date().toISOString().split('T')[0]).length}
              </div>
              <p className="text-sm text-gray-600">Today's Engagement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pi Network Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Pi Network Benefits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">By Watching Pi Ads:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Support the Pi Network ecosystem</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Access free habit tracker</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Learn about Pi Network features</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Stay updated with Pi developments</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Pi Network Features:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <Pi className="h-4 w-4 text-yellow-500" />
                  <span>Mine Pi on your phone</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Pi className="h-4 w-4 text-yellow-500" />
                  <span>Pi Browser for Web3</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Pi className="h-4 w-4 text-yellow-500" />
                  <span>Pi Apps ecosystem</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Pi className="h-4 w-4 text-yellow-500" />
                  <span>Pi Node for network security</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Ad History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            Recent Ad History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {adHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No ad history yet. Start watching Pi Network ads to build your history!</p>
            ) : (
              adHistory.map((ad) => (
                <div key={ad.id} className={`flex items-center justify-between p-4 rounded-lg border ${ad.archived ? 'bg-gray-50 opacity-75' : 'bg-white'}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${
                          ad.type === 'video' ? 'bg-red-500' : 
                          ad.type === 'banner' ? 'bg-blue-500' : 
                          'bg-purple-500'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{ad.adTitle}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{ad.date}</span>
                          <span>{ad.duration}s</span>
                          <Badge variant="outline" className="text-xs">
                            {ad.type}
                          </Badge>
                          {ad.archived && (
                            <Badge variant="outline" className="text-xs text-orange-600">
                              Archived
                            </Badge>
                          )}
                        </div>
                        {ad.notes && (
                          <p className="text-sm text-gray-600 mt-1">{ad.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    {/* Edit Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(ad)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>

                    {/* Duplicate Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateAdEntry(ad.id)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>

                    {/* Archive/Restore Button */}
                    {ad.archived ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => restoreAdEntry(ad.id)}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => archiveAdEntry(ad.id)}
                      >
                        <Archive className="h-3 w-3" />
                      </Button>
                    )}

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteAdEntry(ad.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Join the Pi Network Community
            </h3>
            <p className="text-gray-600 mb-4">
              Become a Pi pioneer and be part of the future of digital currency
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => window.open('https://minepi.com/Wain2020', '_blank')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Pi Network
              </Button>
              <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-50">
                <Users className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Ad Entry Modal */}
      {showEditModal && editingAd && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Edit Ad Entry
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Ad Title</Label>
                <Input
                  value={editForm.adTitle}
                  onChange={(e) => setEditForm({...editForm, adTitle: e.target.value})}
                  placeholder="Enter ad title"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration (seconds)</Label>
                  <Input
                    type="number"
                    value={editForm.duration}
                    onChange={(e) => setEditForm({...editForm, duration: parseInt(e.target.value)})}
                    min="1"
                    max="300"
                  />
                </div>
                <div>
                  <Label>Ad Type</Label>
                  <Select value={editForm.type} onValueChange={(value) => setEditForm({...editForm, type: value as any})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="interactive">Interactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                  placeholder="Add notes about this ad..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={saveEditedAd} className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  );
}; 