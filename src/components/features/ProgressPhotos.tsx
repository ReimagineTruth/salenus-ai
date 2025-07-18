import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Key, Camera, Target, TrendingUp, Calendar, Plus, Upload, Image, Edit, Trash, Download, Share, ArrowUp } from 'lucide-react';

export const ProgressPhotos: React.FC<{ onUpgrade?: () => void }> = ({ onUpgrade }) => {
  const { user, hasFeature } = useAuth();
  const [photos, setPhotos] = useState([
    {
      id: 1,
      title: 'Fitness Journey - Month 1',
      date: '2024-01-01',
      category: 'Fitness',
      beforePhoto: '/placeholder.svg',
      afterPhoto: '/placeholder.svg',
      notes: 'Started my fitness journey with regular workouts and better nutrition.',
      measurements: {
        weight: '75kg',
        bodyFat: '18%',
        muscleMass: '65%'
      },
      tags: ['fitness', 'transformation', 'month1']
    },
    {
      id: 2,
      title: 'Weight Loss Progress',
      date: '2024-01-15',
      category: 'Weight Loss',
      beforePhoto: '/placeholder.svg',
      afterPhoto: '/placeholder.svg',
      notes: 'Consistent diet and exercise routine showing results.',
      measurements: {
        weight: '72kg',
        bodyFat: '16%',
        muscleMass: '67%'
      },
      tags: ['weightloss', 'progress', 'diet']
    },
    {
      id: 3,
      title: 'Muscle Building Journey',
      date: '2024-01-30',
      category: 'Muscle Building',
      beforePhoto: '/placeholder.svg',
      afterPhoto: '/placeholder.svg',
      notes: 'Focus on strength training and protein intake.',
      measurements: {
        weight: '74kg',
        bodyFat: '15%',
        muscleMass: '70%'
      },
      tags: ['muscle', 'strength', 'training']
    }
  ]);
  const [showUpload, setShowUpload] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    category: '',
    notes: '',
    measurements: {
      weight: '',
      bodyFat: '',
      muscleMass: ''
    },
    tags: []
  });

  if (!user) return null;
  if (!hasFeature('progress_photos')) {
    return (
      <Card className="border-slate-200">
        <CardContent className="pt-6 text-center">
          <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Progress Photos</h3>
          <p className="text-slate-500 mb-4">Track your physical progress with before/after photos and measurements.</p>
          <Button onClick={onUpgrade} className="bg-indigo-600 hover:bg-indigo-700">
            <ArrowUp className="h-4 w-4 mr-2" />Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    );
  }

  const addPhoto = () => {
    if (newPhoto.title && newPhoto.category) {
      const photo = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        beforePhoto: '/placeholder.svg',
        afterPhoto: '/placeholder.svg',
        ...newPhoto
      };
      setPhotos([photo, ...photos]);
      setNewPhoto({
        title: '',
        category: '',
        notes: '',
        measurements: { weight: '', bodyFat: '', muscleMass: '' },
        tags: []
      });
      setShowUpload(false);
    }
  };

  const categories = ['Fitness', 'Weight Loss', 'Muscle Building', 'General Health', 'Other'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Progress Photos</h2>
          <p className="text-slate-600">Track your physical progress with before/after photos and measurements.</p>
        </div>
        <Badge className="bg-indigo-100 text-indigo-700">Pro</Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Photos</p>
                <p className="text-2xl font-bold text-slate-900">{photos.length}</p>
              </div>
              <Camera className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Categories</p>
                <p className="text-2xl font-bold text-slate-900">{new Set(photos.map(p => p.category)).size}</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Progress</p>
                <p className="text-2xl font-bold text-slate-900">+8.5kg</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Last Update</p>
                <p className="text-2xl font-bold text-slate-900">2d ago</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Button */}
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowUpload(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Progress Photo
        </Button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <Card className="border-2 border-indigo-200">
          <CardHeader>
            <CardTitle>Add Progress Photo</CardTitle>
            <CardDescription>Upload before/after photos and track your measurements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto({...newPhoto, title: e.target.value})}
                  placeholder="e.g., Fitness Journey - Month 1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={newPhoto.category}
                  onChange={(e) => setNewPhoto({...newPhoto, category: e.target.value})}
                  className="w-full p-2 border border-slate-300 rounded-md"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={newPhoto.notes}
                onChange={(e) => setNewPhoto({...newPhoto, notes: e.target.value})}
                placeholder="Describe your progress, challenges, and achievements..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Weight</label>
                <Input
                  value={newPhoto.measurements.weight}
                  onChange={(e) => setNewPhoto({
                    ...newPhoto, 
                    measurements: {...newPhoto.measurements, weight: e.target.value}
                  })}
                  placeholder="e.g., 75kg"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Body Fat %</label>
                <Input
                  value={newPhoto.measurements.bodyFat}
                  onChange={(e) => setNewPhoto({
                    ...newPhoto, 
                    measurements: {...newPhoto.measurements, bodyFat: e.target.value}
                  })}
                  placeholder="e.g., 18%"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Muscle Mass %</label>
                <Input
                  value={newPhoto.measurements.muscleMass}
                  onChange={(e) => setNewPhoto({
                    ...newPhoto, 
                    measurements: {...newPhoto.measurements, muscleMass: e.target.value}
                  })}
                  placeholder="e.g., 65%"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Before Photo</label>
                <div className="mt-2 p-4 border-2 border-dashed border-slate-300 rounded-lg text-center">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Click to upload before photo</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">After Photo</label>
                <div className="mt-2 p-4 border-2 border-dashed border-slate-300 rounded-lg text-center">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Click to upload after photo</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={addPhoto} className="bg-indigo-600 hover:bg-indigo-700">
                Save Progress
              </Button>
              <Button variant="outline" onClick={() => setShowUpload(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photos Grid */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Photos</TabsTrigger>
          <TabsTrigger value="fitness">Fitness</TabsTrigger>
          <TabsTrigger value="weightloss">Weight Loss</TabsTrigger>
          <TabsTrigger value="muscle">Muscle Building</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="aspect-square bg-slate-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image className="h-12 w-12 text-slate-400" />
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/80">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{photo.title}</h3>
                    <Badge variant="outline">{photo.category}</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{photo.notes}</p>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <p className="font-medium">Weight</p>
                      <p className="text-slate-600">{photo.measurements.weight}</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <p className="font-medium">Body Fat</p>
                      <p className="text-slate-600">{photo.measurements.bodyFat}</p>
                    </div>
                    <div className="text-center p-2 bg-slate-50 rounded">
                      <p className="font-medium">Muscle</p>
                      <p className="text-slate-600">{photo.measurements.muscleMass}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(photo.date).toLocaleDateString()}</span>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Share className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fitness" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.filter(p => p.category === 'Fitness').map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="aspect-square bg-slate-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image className="h-12 w-12 text-slate-400" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">{photo.title}</h3>
                  <p className="text-sm text-slate-600">{photo.notes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="weightloss" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.filter(p => p.category === 'Weight Loss').map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="aspect-square bg-slate-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image className="h-12 w-12 text-slate-400" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">{photo.title}</h3>
                  <p className="text-sm text-slate-600">{photo.notes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="muscle" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.filter(p => p.category === 'Muscle Building').map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="aspect-square bg-slate-100 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image className="h-12 w-12 text-slate-400" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">{photo.title}</h3>
                  <p className="text-sm text-slate-600">{photo.notes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Progress Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Summary</CardTitle>
          <CardDescription>Your overall progress across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900">Weight Loss</h4>
              <p className="text-2xl font-bold text-green-700">-3kg</p>
              <p className="text-sm text-green-600">in 30 days</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900">Body Fat</h4>
              <p className="text-2xl font-bold text-blue-700">-3%</p>
              <p className="text-sm text-blue-600">reduction</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Camera className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-900">Photos</h4>
              <p className="text-2xl font-bold text-purple-700">{photos.length}</p>
              <p className="text-sm text-purple-600">progress entries</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
