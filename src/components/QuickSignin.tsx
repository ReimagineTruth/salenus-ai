import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LogIn, CheckCircle, Zap, UserPlus, Shield } from 'lucide-react';
import { PiAuthButton } from './PiAuthButton';

interface QuickSigninProps {
  onSuccess?: () => void;
}

export const QuickSignin: React.FC<QuickSigninProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      // Sign in with existing credentials
      await login(email, password);
      
      // Show welcome back message
      const userName = email.split('@')[0];
      toast({
        title: "Welcome back! 👋",
        description: `Great to see you again, ${userName}! Taking you to your dashboard...`,
        duration: 4000,
      });

      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Signin error:', error);
      setError(error instanceof Error ? error.message : 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center">
            <img src="/logo.png" alt="Salenus A.I Logo" className="h-12 w-12 rounded-full" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to your Salenus A.I account and continue your journey
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Benefits for Returning Users */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Access your habits and progress</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Continue your streaks and goals</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Sync across all your devices</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Earn more Pi rewards</span>
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-300 focus:border-indigo-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-gray-300 focus:border-indigo-500"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>

            {/* Pi Network Authentication */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <PiAuthButton
              onAuthSuccess={(auth) => {
                console.log('Pi auth success:', auth);
                // Auto-login user after Pi authentication
                const userName = auth.user?.username || 'Pi User';
                toast({
                  title: "Pi Network Connected! 🎉",
                  description: `Welcome, ${userName}! Taking you to your dashboard...`,
                  duration: 4000,
                });
                
                setTimeout(() => {
                  navigate('/dashboard');
                }, 1000);
              }}
              onAuthError={(error) => {
                console.error('Pi auth error:', error);
              }}
              className="w-full"
              variant="outline"
            >
              <Shield className="w-4 h-4 mr-2" />
              Connect with Pi Network
            </PiAuthButton>
          </form>

          {/* Forgot Password & Sign Up Links */}
          <div className="space-y-3 text-center">
            <div>
              <button
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Forgot your password?
              </button>
            </div>
            
            <div className="border-t border-gray-200 pt-3">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center justify-center mx-auto space-x-1"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Create Free Account</span>
                </button>
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              🔒 Secure • 📱 Mobile-friendly • ⚡ Instant access
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Powered by Pi Network
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 