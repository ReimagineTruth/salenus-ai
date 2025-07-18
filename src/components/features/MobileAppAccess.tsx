import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Download, Apple, Smartphone as Android, Globe, CheckCircle, Star, Users, Zap, Shield, Wifi, WifiOff, Settings, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AppStore {
  name: string;
  icon: React.ReactNode;
  url: string;
  rating: number;
  downloads: string;
  status: 'available' | 'coming-soon' | 'beta';
}

interface DeviceCompatibility {
  platform: string;
  icon: React.ReactNode;
  minVersion: string;
  features: string[];
  status: 'supported' | 'beta' | 'planned';
}

export const MobileAppAccess: React.FC = () => {
  const { user } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState<'ios' | 'android' | 'web'>('ios');

  const appStores: AppStore[] = [
    {
      name: 'App Store',
      icon: <Apple className="h-5 w-5" />,
      url: 'https://apps.apple.com/app/salenus-ai',
      rating: 4.8,
      downloads: '10K+',
      status: 'coming-soon'
    },
    {
      name: 'Google Play',
      icon: <Android className="h-5 w-5" />,
      url: 'https://play.google.com/store/apps/details?id=com.salenus.ai',
      rating: 4.7,
      downloads: '15K+',
      status: 'coming-soon'
    }
  ];

  const deviceCompatibility: DeviceCompatibility[] = [
    {
      platform: 'iOS',
      icon: <Apple className="h-5 w-5" />,
      minVersion: 'iOS 14.0+',
      features: ['Full sync', 'Offline mode', 'Push notifications', 'Biometric login'],
      status: 'supported'
    },
    {
      platform: 'Android',
      icon: <Android className="h-5 w-5" />,
      minVersion: 'Android 8.0+',
      features: ['Full sync', 'Offline mode', 'Push notifications', 'Fingerprint login'],
      status: 'supported'
    },
    {
      platform: 'Web App',
      icon: <Globe className="h-5 w-5" />,
      minVersion: 'All browsers',
      features: ['Full sync', 'PWA support', 'Desktop notifications', 'Progressive web app'],
      status: 'supported'
    }
  ];

  const mobileFeatures = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Offline Mode',
      description: 'Access your habits and tasks even without internet connection'
    },
    {
      icon: <Bell className="h-5 w-5" />,
      title: 'Smart Notifications',
      description: 'Get personalized reminders based on your schedule and habits'
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Secure Sync',
      description: 'End-to-end encrypted data synchronization across all devices'
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: 'Customizable',
      description: 'Personalize your experience with themes and preferences'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'coming-soon': return 'bg-yellow-100 text-yellow-800';
      case 'beta': return 'bg-blue-100 text-blue-800';
      case 'supported': return 'bg-green-100 text-green-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'coming-soon': return 'Coming Soon';
      case 'beta': return 'Beta';
      case 'supported': return 'Supported';
      case 'planned': return 'Planned';
      default: return 'Unknown';
    }
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mobile App Access</CardTitle>
          <CardDescription>Please sign in to access mobile app information</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Mobile App Access</h2>
          <p className="text-slate-600">Access Salenus A.I on iOS and Android with full functionality</p>
        </div>
        <Badge className="bg-blue-100 text-blue-800">
          <Smartphone className="h-3 w-3 mr-1" />
          Mobile Ready
        </Badge>
      </div>

      {/* App Store Links */}
      <Card>
        <CardHeader>
          <CardTitle>Download the App</CardTitle>
          <CardDescription>
            Get the Salenus A.I mobile app for the best experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appStores.map((store) => (
              <div key={store.name} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {store.icon}
                    <span className="font-semibold">{store.name}</span>
                  </div>
                  <Badge className={getStatusColor(store.status)}>
                    {getStatusText(store.status)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{store.rating}</span>
                  </div>
                  <span className="text-sm text-slate-600">{store.downloads} downloads</span>
                </div>
                
                <Button 
                  className="w-full" 
                  disabled={store.status === 'coming-soon'}
                  onClick={() => window.open(store.url, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {store.status === 'coming-soon' ? 'Coming Soon' : 'Download'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* QR Code Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>
            Scan the QR code to access the web app on your mobile device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://salenus.ai/app" 
                alt="QR Code" 
                className="rounded"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Web App Access</h3>
              <p className="text-sm text-slate-600 mb-3">
                Scan this QR code with your mobile device to access Salenus A.I directly in your browser.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">No download required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Full functionality</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Works on all devices</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Device Compatibility */}
      <Card>
        <CardHeader>
          <CardTitle>Device Compatibility</CardTitle>
          <CardDescription>
            Check which devices and platforms are supported
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deviceCompatibility.map((device) => (
              <div key={device.platform} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {device.icon}
                    <div>
                      <h3 className="font-semibold">{device.platform}</h3>
                      <p className="text-sm text-slate-600">{device.minVersion}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(device.status)}>
                    {getStatusText(device.status)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {device.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Features */}
      <Card>
        <CardHeader>
          <CardTitle>Mobile Features</CardTitle>
          <CardDescription>
            Discover what makes our mobile experience special
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mobileFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                  <p className="text-xs text-slate-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Experience</CardTitle>
          <CardDescription>
            Learn about the specific features for each platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {['ios', 'android', 'web'].map((platform) => (
              <Button
                key={platform}
                variant={selectedPlatform === platform ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatform(platform as any)}
              >
                {platform === 'ios' && <Apple className="h-4 w-4 mr-2" />}
                {platform === 'android' && <Android className="h-4 w-4 mr-2" />}
                {platform === 'web' && <Globe className="h-4 w-4 mr-2" />}
                {platform.toUpperCase()}
              </Button>
            ))}
          </div>
          
          <div className="border border-slate-200 rounded-lg p-4">
            {selectedPlatform === 'ios' && (
              <div>
                <h3 className="font-semibold mb-3">iOS Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Face ID & Touch ID authentication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Apple Health integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Siri shortcuts support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Widget support</span>
                  </div>
                </div>
              </div>
            )}
            
            {selectedPlatform === 'android' && (
              <div>
                <h3 className="font-semibold mb-3">Android Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Fingerprint & face unlock</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Google Fit integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Material Design 3</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Home screen widgets</span>
                  </div>
                </div>
              </div>
            )}
            
            {selectedPlatform === 'web' && (
              <div>
                <h3 className="font-semibold mb-3">Web App Features</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Progressive Web App (PWA)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Install to home screen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Cross-platform compatibility</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">No app store required</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Smartphone className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-2">Mobile Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Use the mobile app for quick habit tracking on the go</li>
                <li>• Enable push notifications for better habit reminders</li>
                <li>• Sync your data across all devices automatically</li>
                <li>• Use biometric login for quick and secure access</li>
                <li>• The web app works on any device with a browser</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
