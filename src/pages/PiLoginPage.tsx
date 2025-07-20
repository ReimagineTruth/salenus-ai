import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { PiAuthButton } from '@/components/PiAuthButton';
import { 
  Shield, 
  CheckCircle, 
  Zap, 
  Coins, 
  Gift, 
  ArrowRight,
  Star,
  Lock,
  Smartphone
} from 'lucide-react';

export const PiLoginPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();

  const handlePiAuthSuccess = (auth: any) => {
    setIsAuthenticated(true);
    setUserData(auth);
    
    toast({
      title: "Pi Network Connected! 🎉",
      description: `Welcome, ${auth.user?.username || 'User'}! You can now use Pi payments and earn rewards.`,
      duration: 5000,
    });

    // Auto-redirect to dashboard after successful authentication
    setTimeout(() => {
      navigate('/dashboard');
    }, 2000);
  };

  const handlePiAuthError = (error: any) => {
    console.error('Pi authentication error:', error);
    toast({
      title: "Authentication Failed",
      description: "Please ensure you're using Pi Browser or Pi Testnet.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
            <img src="/logo.png" alt="Salenus A.I Logo" className="h-12 w-12 rounded-full" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Salenus A.I
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Connect with Pi Network to unlock premium features and earn rewards
          </p>
          <Badge variant="secondary" className="text-sm">
            Powered by Pi Network
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pi Authentication Card */}
          <Card className="w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Connect with Pi Network
              </CardTitle>
              <CardDescription>
                Secure blockchain-based authentication and payments
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Authentication Status */}
              {isAuthenticated && userData ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Connected to Pi Network</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Welcome, {userData.user?.username || 'User'}! Redirecting to dashboard...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Pi Auth Button */}
                  <PiAuthButton
                    onAuthSuccess={handlePiAuthSuccess}
                    onAuthError={handlePiAuthError}
                    className="w-full h-12 text-lg"
                    size="lg"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Connect with Pi Network
                  </PiAuthButton>

                  {/* Requirements */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Requirements:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4" />
                        <span>Pi Browser or Pi Testnet</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Lock className="w-4 h-4" />
                        <span>Pi Network account</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Zap className="w-4 h-4" />
                        <span>Internet connection</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Alternative Login */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Don't have Pi Network?
                </p>
                <Button
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="text-sm"
                >
                  Sign in with Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Pi Network Benefits
              </CardTitle>
              <CardDescription>
                Unlock exclusive features with Pi cryptocurrency
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Benefits List */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Coins className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Pi Payments</h4>
                    <p className="text-sm text-gray-600">
                      Pay for premium features using Pi cryptocurrency with instant transactions
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Earn Rewards</h4>
                    <p className="text-sm text-gray-600">
                      Complete habits and watch ads to earn Pi rewards automatically
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Secure Identity</h4>
                    <p className="text-sm text-gray-600">
                      Blockchain-verified identity with no personal data required
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Premium Features</h4>
                    <p className="text-sm text-gray-600">
                      Access AI coaching, advanced analytics, and exclusive features
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Comparison */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">What you get with Pi:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Basic Plan</span>
                    <span className="text-green-600 font-medium">5 Pi/month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pro Plan</span>
                    <span className="text-green-600 font-medium">10 Pi/month</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Premium Plan</span>
                    <span className="text-green-600 font-medium">15 Pi/month</span>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <Button
                onClick={() => navigate('/pi-network')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Explore Pi Network Features
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            🔒 Secure • 📱 Mobile-friendly • ⚡ Instant access
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Pi Network integration powered by official Pi SDK
          </p>
        </div>
      </div>
    </div>
  );
}; 