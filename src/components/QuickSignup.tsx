import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle, Zap, Shield } from 'lucide-react';
import { PiAuthButton } from './PiAuthButton';

interface QuickSignupProps {
  onSuccess?: () => void;
}

export const QuickSignup: React.FC<QuickSignupProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password || !name) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      // Create free account automatically
      await register(email, password, name, 'Free');
      
      // Show success message
      toast({
        title: "Welcome to Salenus A.I! 🎉",
        description: `Account created successfully! Let's get you started with your first habit.`,
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
      console.error('Signup error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create account. Please try again.');
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
            Welcome to Salenus A.I
          </CardTitle>
          <CardDescription className="text-gray-600">
            Create your free account and start building better habits today
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Benefits List */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>2 free habits to get started</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Track your progress with streaks</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Earn Pi rewards for consistency</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Upgrade anytime for more features</span>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-gray-300 focus:border-indigo-500"
              />
            </div>
            
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
                placeholder="Create a password"
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
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4" />
                  <span>Start Free - No Payment Required</span>
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
                // Auto-create account after Pi authentication
                const userName = auth.user?.username || 'Pi User';
                toast({
                  title: "Pi Network Connected! 🎉",
                  description: `Welcome, ${userName}! Creating your account...`,
                  duration: 4000,
                });
                
                // Auto-register user with Pi credentials
                setTimeout(async () => {
                  try {
                    await register(`${userName}@pi.network`, 'pi-auth-password', userName, 'Free');
                    navigate('/dashboard');
                  } catch (error) {
                    console.error('Auto-registration error:', error);
                  }
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

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Sign In
              </button>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              🔒 Secure • 📱 Mobile-friendly • ⚡ 30-second setup
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