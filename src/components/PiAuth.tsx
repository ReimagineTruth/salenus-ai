import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PiNetworkService, PiAuth } from '@/lib/pi-network';
import { toast } from '@/hooks/use-toast';
import { Loader2, Wallet, User, Shield } from 'lucide-react';

interface PiAuthProps {
  onAuthSuccess?: (auth: PiAuth) => void;
  onAuthError?: (error: any) => void;
  className?: string;
}

export const PiAuth: React.FC<PiAuthProps> = ({ 
  onAuthSuccess, 
  onAuthError, 
  className = '' 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authData, setAuthData] = useState<PiAuth | null>(null);

  const piService = PiNetworkService.getInstance();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuthStatus = () => {
      try {
        const user = piService.getCurrentUser();
        const auth = piService.getCurrentAuth();
        
        if (user && auth) {
          setIsAuthenticated(true);
          setCurrentUser(user);
          setAuthData(auth);
        }
      } catch (error) {
        console.error('Error checking auth status in PiAuth:', error);
        // Don't crash the component, just log the error
      }
    };

    checkAuthStatus();
  }, []);

  const handlePiAuth = async () => {
    setIsLoading(true);
    
    try {
      const auth = await piService.authenticate();
      
      setIsAuthenticated(true);
      setAuthData(auth);
      setCurrentUser(piService.getCurrentUser());
      
      toast({
        title: "Pi Authentication Successful",
        description: `Welcome, ${auth.user.username}!`,
      });
      
      onAuthSuccess?.(auth);
    } catch (error) {
      console.error('Pi authentication failed:', error);
      
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with Pi Network. Please try again.",
        variant: "destructive",
      });
      
      onAuthError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    piService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthData(null);
    
    toast({
      title: "Logged Out",
      description: "Successfully logged out of Pi Network.",
    });
  };

  if (isAuthenticated && currentUser) {
    return (
      <Card className={`w-full max-w-md ${className}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl">Pi Network Connected</CardTitle>
          <CardDescription>
            You're authenticated with Pi Network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="font-medium">Username</span>
            </div>
            <Badge variant="secondary">{currentUser.username}</Badge>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-gray-600" />
              <span className="font-medium">User ID</span>
            </div>
            <Badge variant="outline" className="font-mono text-xs">
              {currentUser.uid.slice(0, 8)}...
            </Badge>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="outline" 
            className="w-full"
          >
            Disconnect Pi Network
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-xl">Connect with Pi Network</CardTitle>
        <CardDescription>
          Sign in with your Pi Network account to access premium features and earn Pi rewards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Secure authentication with Pi Network</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Access to Pi payments and rewards</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Enhanced privacy and security</span>
          </div>
        </div>
        
        <Button 
          onClick={handlePiAuth}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Connect Pi Network
            </>
          )}
        </Button>
        
        <p className="text-xs text-gray-500 text-center">
          By connecting, you agree to our terms of service and privacy policy
        </p>
      </CardContent>
    </Card>
  );
}; 