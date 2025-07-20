import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PiAuth } from './PiAuth';
import { PiPayment } from './PiPayment';
import { PiAdNetwork } from './PiAdNetwork';
import { PiSDKTest } from './PiSDKTest';
import { PiAds } from './PiAds';
import { KeyValidation } from './KeyValidation';
import { ValidationVerifier } from './ValidationVerifier';
import { PiNetworkService, PiAuth as PiAuthType } from '@/lib/pi-network';
import { toast } from '@/hooks/use-toast';
import { 
  Wallet, 
  Coins, 
  Gift, 
  User, 
  Settings, 
  TrendingUp,
  Shield,
  Star,
  Zap,
  CheckCircle,
  Play,
  Key
} from 'lucide-react';

interface PiIntegrationDashboardProps {
  className?: string;
}

export const PiIntegrationDashboard: React.FC<PiIntegrationDashboardProps> = ({
  className = ''
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authData, setAuthData] = useState<PiAuthType | null>(null);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [activeTab, setActiveTab] = useState('validation');

  const piService = PiNetworkService.getInstance();

  useEffect(() => {
    // Check authentication status on mount
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
        console.error('Error checking auth status:', error);
        // Don't crash the app, just log the error
      }
    };

    checkAuthStatus();
  }, []);

  const handleAuthSuccess = (auth: PiAuthType) => {
    setIsAuthenticated(true);
    setAuthData(auth);
    setCurrentUser(piService.getCurrentUser());
    
    toast({
      title: "Welcome to Pi Network!",
      description: "You can now use Pi payments and earn rewards.",
    });
  };

  const handleAuthError = (error: any) => {
    console.error('Pi authentication error:', error);
  };

  const handlePaymentSuccess = (paymentId: string, txid: string) => {
    setTotalSpent(prev => prev + 1); // This would be the actual payment amount
    
    toast({
      title: "Payment Successful!",
      description: "Your Pi payment has been processed successfully.",
    });
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
  };

  const handleAdComplete = (adId: string, reward: number) => {
    setTotalEarned(prev => prev + reward);
    
    toast({
      title: "Reward Earned!",
      description: `You earned ${reward} Pi for watching the ad.`,
    });
  };

  const handleAdError = (error: any) => {
    console.error('Ad error:', error);
  };

  const getPlanPrice = (plan: string) => {
    const prices = {
      'Basic': 1,
      'Pro': 5,
      'Premium': 10
    };
    return prices[plan as keyof typeof prices] || 0;
  };

  return (
    <div className={`w-full max-w-6xl mx-auto p-6 ${className}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Pi Network Integration
        </h1>
        <p className="text-gray-600 text-center">
          Connect with Pi Network to access payments, rewards, and premium features
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="validation" className="flex items-center space-x-2">
            <Key className="w-4 h-4" />
            <span>Validation</span>
          </TabsTrigger>
          <TabsTrigger value="verifier" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Verifier</span>
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="auth" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Authentication</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center space-x-2">
            <Coins className="w-4 h-4" />
            <span>Payments</span>
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex items-center space-x-2">
            <Gift className="w-4 h-4" />
            <span>Rewards</span>
          </TabsTrigger>
          <TabsTrigger value="ads" className="flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Pi Ads</span>
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>SDK Test</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Authentication Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pi Network Status</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isAuthenticated ? 'Connected' : 'Not Connected'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isAuthenticated ? currentUser?.username : 'Connect to start'}
                </p>
              </CardContent>
            </Card>

            {/* Total Earned */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalEarned} Pi</div>
                <p className="text-xs text-muted-foreground">
                  From ads and rewards
                </p>
              </CardContent>
            </Card>

            {/* Total Spent */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSpent} Pi</div>
                <p className="text-xs text-muted-foreground">
                  On subscriptions and features
                </p>
              </CardContent>
            </Card>

            {/* Balance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.max(0, totalEarned - totalSpent)} Pi
                </div>
                <p className="text-xs text-muted-foreground">
                  Current balance
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your Pi Network integration
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => setActiveTab('auth')}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Shield className="w-6 h-6" />
                <span>Connect Pi Network</span>
              </Button>
              
              <Button
                onClick={() => setActiveTab('payments')}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Coins className="w-6 h-6" />
                <span>Make Payment</span>
              </Button>
              
              <Button
                onClick={() => setActiveTab('rewards')}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Gift className="w-6 h-6" />
                <span>Earn Rewards</span>
              </Button>
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Pi Authentication</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Secure authentication using Pi Network's blockchain-based identity system.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Blockchain-verified identity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">No personal data required</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Instant verification</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-green-500" />
                  <span>Pi Payments</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Pay for premium features and subscriptions using Pi cryptocurrency.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Instant transactions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Low transaction fees</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Secure blockchain payments</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Gift className="w-5 h-5 text-purple-500" />
                  <span>Pi Rewards</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Earn Pi cryptocurrency by watching ads and completing tasks.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Watch ads for Pi</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Complete tasks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs">Refer friends</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="auth" className="space-y-6">
          <div className="flex justify-center">
            <PiAuth
              onAuthSuccess={handleAuthSuccess}
              onAuthError={handleAuthError}
              className="w-full max-w-md"
            />
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Subscription Plans */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>
                  Choose a plan and pay with Pi cryptocurrency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Basic', 'Pro', 'Premium'].map((plan) => (
                  <div key={plan} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{plan} Plan</h3>
                      <Badge variant="secondary">{getPlanPrice(plan)} Pi</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {plan === 'Basic' && 'Essential features for productivity'}
                      {plan === 'Pro' && 'Advanced features and analytics'}
                      {plan === 'Premium' && 'All features with priority support'}
                    </p>
                    <PiPayment
                      amount={getPlanPrice(plan)}
                      memo={`${plan} Plan Subscription - Salenus AI`}
                      metadata={{ plan, type: 'subscription' }}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      buttonText={`Subscribe to ${plan}`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Custom Payment */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Payment</CardTitle>
                <CardDescription>
                  Make a custom payment with Pi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PiPayment
                  amount={1}
                  memo="Custom Payment - Salenus AI"
                  metadata={{ type: 'custom' }}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  buttonText="Pay 1 Pi"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-6">
          <div className="flex justify-center">
            <PiAdNetwork
              onAdComplete={handleAdComplete}
              onAdError={handleAdError}
              className="w-full max-w-md"
            />
          </div>
        </TabsContent>

        <TabsContent value="ads" className="space-y-6">
          <div className="flex justify-center">
            <PiAds
              onAdComplete={(adType, result) => {
                console.log(`${adType} ad completed:`, result);
                if (adType === 'rewarded' && result.result === 'AD_REWARDED') {
                  handleAdComplete('rewarded', 0.1);
                }
              }}
              onRewardEarned={(reward) => {
                console.log('Reward earned:', reward);
                setTotalEarned(prev => prev + (reward?.amount || 0));
              }}
              className="w-full max-w-2xl"
            />
          </div>
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <div className="flex justify-center">
            <KeyValidation />
          </div>
        </TabsContent>

        <TabsContent value="verifier" className="space-y-6">
          <div className="flex justify-center">
            <ValidationVerifier />
          </div>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <div className="flex justify-center">
            <PiSDKTest />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 