import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PiAuthButton } from './PiAuthButton';
import { PiNetworkService } from '@/lib/pi-network';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  RefreshCw,
  Settings,
  Shield,
  User,
  Key
} from 'lucide-react';

export const SandboxTest: React.FC = () => {
  const [piService] = useState(() => PiNetworkService.getInstance());
  const [authStatus, setAuthStatus] = useState<'unknown' | 'authenticated' | 'not_authenticated'>('unknown');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentAuth, setCurrentAuth] = useState<any>(null);
  const [sdkStatus, setSdkStatus] = useState<'checking' | 'available' | 'not_available'>('checking');
  const [sandboxMode, setSandboxMode] = useState<boolean>(true);

  useEffect(() => {
    checkSDKStatus();
    checkAuthStatus();
  }, []);

  const checkSDKStatus = () => {
    if (typeof window !== 'undefined' && window.Pi) {
      setSdkStatus('available');
      console.log('Pi SDK is available');
    } else {
      setSdkStatus('not_available');
      console.warn('Pi SDK is not available');
    }
  };

  const checkAuthStatus = () => {
    try {
      const auth = piService.getCurrentAuth();
      const user = piService.getCurrentUser();
      
      if (auth && user) {
        setAuthStatus('authenticated');
        setCurrentAuth(auth);
        setCurrentUser(user);
        console.log('User is authenticated:', { auth, user });
      } else {
        setAuthStatus('not_authenticated');
        setCurrentAuth(null);
        setCurrentUser(null);
        console.log('User is not authenticated');
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setAuthStatus('not_authenticated');
    }
  };

  const handleAuthSuccess = (auth: any) => {
    console.log('Authentication successful:', auth);
    setAuthStatus('authenticated');
    setCurrentAuth(auth);
    setCurrentUser(auth.user);
    checkAuthStatus();
  };

  const handleAuthError = (error: any) => {
    console.error('Authentication failed:', error);
    setAuthStatus('not_authenticated');
  };

  const handleRefresh = () => {
    checkSDKStatus();
    checkAuthStatus();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'authenticated':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'not_authenticated':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'available':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'not_available':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'authenticated':
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'not_authenticated':
      case 'not_available':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pi Network Sandbox Test</h1>
        <p className="text-gray-600">Testing Pi Network authentication in sandbox mode</p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">SDK Status</p>
                <p className="text-lg font-semibold">{sdkStatus}</p>
              </div>
              {getStatusIcon(sdkStatus)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Auth Status</p>
                <p className="text-lg font-semibold">{authStatus}</p>
              </div>
              {getStatusIcon(authStatus)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sandbox Mode</p>
                <p className="text-lg font-semibold">{sandboxMode ? 'Enabled' : 'Disabled'}</p>
              </div>
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Pi API Key</label>
              <div className="mt-1 p-2 bg-gray-100 rounded text-sm font-mono">
                giynqmyzwzxpgks0xoevamcbpwfonpjq0fmzxb1vye0itgiuv0sxoqkbd0qtpx79
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Environment</label>
              <div className="mt-1">
                <Badge className="bg-yellow-100 text-yellow-800">Sandbox</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Status
            </Button>
            <Button 
              onClick={() => piService.init()} 
              variant="outline" 
              size="sm"
              disabled={sdkStatus === 'not_available'}
            >
              <Shield className="h-4 w-4 mr-2" />
              Initialize SDK
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Authentication Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Authentication Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Status</p>
              <Badge className={getStatusColor(authStatus)}>
                {authStatus === 'authenticated' ? 'Authenticated' : 'Not Authenticated'}
              </Badge>
            </div>
            <PiAuthButton
              onAuthSuccess={handleAuthSuccess}
              onAuthError={handleAuthError}
              variant="default"
              size="sm"
            >
              {authStatus === 'authenticated' ? 'Re-authenticate' : 'Authenticate with Pi'}
            </PiAuthButton>
          </div>

          {currentUser && (
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Authenticated User</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Username:</span> {currentUser.username}
                </div>
                <div>
                  <span className="font-medium">UID:</span> {currentUser.uid}
                </div>
                <div>
                  <span className="font-medium">Roles:</span> {currentUser.roles?.join(', ') || 'None'}
                </div>
              </div>
            </div>
          )}

          {currentAuth && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Auth Data</h4>
              <div className="text-sm">
                <div>
                  <span className="font-medium">Access Token:</span> {currentAuth.accessToken ? 'Present' : 'Missing'}
                </div>
                <div>
                  <span className="font-medium">Token Length:</span> {currentAuth.accessToken?.length || 0} characters
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Key className="h-5 w-5" />
            <span>Debug Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Window.Pi Available:</span> {typeof window !== 'undefined' && window.Pi ? 'Yes' : 'No'}
            </div>
            <div>
              <span className="font-medium">Service Instance:</span> {piService ? 'Created' : 'Failed'}
            </div>
            <div>
              <span className="font-medium">setCurrentAuth Method:</span> {typeof piService.setCurrentAuth === 'function' ? 'Available' : 'Missing'}
            </div>
            <div>
              <span className="font-medium">getCurrentAuth Method:</span> {typeof piService.getCurrentAuth === 'function' ? 'Available' : 'Missing'}
            </div>
            <div>
              <span className="font-medium">isUserAuthenticated Method:</span> {typeof piService.isUserAuthenticated === 'function' ? 'Available' : 'Missing'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 