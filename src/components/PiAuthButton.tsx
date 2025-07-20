import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { PiNetworkService } from '@/lib/pi-network';
import { Shield, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface PiAuthButtonProps {
  onAuthSuccess?: (auth: any) => void;
  onAuthError?: (error: any) => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  children?: React.ReactNode;
}

export const PiAuthButton: React.FC<PiAuthButtonProps> = ({
  onAuthSuccess,
  onAuthError,
  className = '',
  variant = 'default',
  size = 'default',
  children
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const piService = PiNetworkService.getInstance();

  const handlePiAuth = async () => {
    setIsLoading(true);
    
    try {
      // Check if Pi SDK is available
      if (typeof window === 'undefined' || !window.Pi) {
        throw new Error('Pi Network SDK not available. Please ensure you are using the Pi Browser or Pi Testnet.');
      }

      const Pi = window.Pi;
      
      // Request authentication with username and payments scopes
      const scopes = ['username', 'payments'];
      
      // Handle incomplete payments if found
      const onIncompletePaymentFound = (payment: any) => {
        console.log('Incomplete payment found:', payment);
        toast({
          title: "Incomplete Payment Found",
          description: "You have an incomplete payment. Please complete it first.",
          variant: "destructive",
        });
      };

      // Authenticate with Pi Network
      const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
      
      console.log('Pi authentication successful:', auth);
      
      // Store authentication data
      piService.setCurrentAuth(auth);
      
      setIsAuthenticated(true);
      
      // Show success message
      toast({
        title: "Pi Network Connected! 🎉",
        description: `Welcome, ${auth.user?.username || 'User'}! You can now use Pi payments.`,
        duration: 4000,
      });

      // Call success callback
      if (onAuthSuccess) {
        onAuthSuccess(auth);
      }
      
    } catch (error) {
      console.error('Pi authentication error:', error);
      
      let errorMessage = 'Failed to authenticate with Pi Network.';
      
      if (error instanceof Error) {
        if (error.message.includes('Pi Browser')) {
          errorMessage = 'Please use Pi Browser or Pi Testnet to authenticate.';
        } else if (error.message.includes('SDK')) {
          errorMessage = 'Pi Network SDK not available. Please refresh and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });

      // Call error callback
      if (onAuthError) {
        onAuthError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined' && window.Pi) {
        window.Pi.logout();
      }
      piService.clearAuth();
      setIsAuthenticated(false);
      
      toast({
        title: "Disconnected from Pi Network",
        description: "You have been logged out of Pi Network.",
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if already authenticated on mount
  React.useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const auth = piService.getCurrentAuth();
        const user = piService.getCurrentUser();
        
        if (auth && user) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    };

    checkAuthStatus();
  }, [piService]);

  return (
    <Button
      onClick={isAuthenticated ? handleLogout : handlePiAuth}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={`${className} ${
        isAuthenticated 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-purple-600 hover:bg-purple-700 text-white'
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Connecting...
        </>
      ) : isAuthenticated ? (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          {children || 'Disconnect Pi Network'}
        </>
      ) : (
        <>
          <Shield className="w-4 h-4 mr-2" />
          {children || 'Connect with Pi Network'}
        </>
      )}
    </Button>
  );
}; 