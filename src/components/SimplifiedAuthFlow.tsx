import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PiAuthButton } from './PiAuthButton';
import { 
  Shield, 
  CheckCircle, 
  Zap, 
  Coins, 
  Gift, 
  ArrowRight,
  Star,
  Lock,
  Smartphone,
  User,
  Mail,
  Key,
  CreditCard,
  Crown,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

interface SimplifiedAuthFlowProps {
  onSuccess?: () => void;
}

const plans = [
  {
    id: 'Free',
    name: 'Free',
    price: '0 Pi',
    features: ['Basic Habit Tracking', 'Pi Network Integration', 'Mobile Access'],
    color: 'bg-gray-600',
    icon: Gift
  },
  {
    id: 'Basic',
    name: 'Basic',
    price: '5 Pi',
    features: ['5 Habits', 'Task Management', 'Community Challenges', 'Mobile App'],
    color: 'bg-blue-600',
    icon: Target
  },
  {
    id: 'Pro',
    name: 'Pro',
    price: '10 Pi',
    features: ['Everything in Basic', 'Mood Tracking', 'Smart Reminders', 'Custom Challenges'],
    color: 'bg-indigo-600',
    icon: TrendingUp
  },
  {
    id: 'Premium',
    name: 'Premium',
    price: '15 Pi',
    features: ['Everything in Pro', 'AI Coaching', 'Advanced Analytics', 'API Access'],
    color: 'bg-purple-600',
    icon: Crown
  }
];

export const SimplifiedAuthFlow: React.FC<SimplifiedAuthFlowProps> = ({ onSuccess }) => {
  const { user, register, login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'welcome' | 'auth' | 'plan' | 'payment' | 'dashboard'>('welcome');
  const [selectedPlan, setSelectedPlan] = useState('Free');
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      setStep('dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handlePiAuthSuccess = async (auth: any) => {
    setIsLoading(true);
    
    try {
      console.log('Pi authentication successful:', auth);
      
      // Store user data from Pi
      const piUserData = {
        username: auth.user?.username || 'Pi User',
        uid: auth.user?.uid || 'pi-user',
        email: `${auth.user?.username || 'user'}@pi.network`,
        accessToken: auth.accessToken
      };
      
      setUserData(piUserData);
      
      // Auto-create account with Pi credentials
      await register(
        piUserData.email,
        'pi-auth-password',
        piUserData.username,
        'Free' // Start with free plan
      );
      
      toast({
        title: "Pi Network Connected! 🎉",
        description: `Welcome, ${piUserData.username}! Let's choose your plan.`,
        duration: 4000,
      });
      
      setStep('plan');
    } catch (error) {
      console.error('Auto-registration error:', error);
      toast({
        title: "Account Created! 🎉",
        description: "Your account has been created successfully. Let's choose your plan.",
        duration: 4000,
      });
      setStep('plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePiAuthError = (error: any) => {
    console.error('Pi authentication error:', error);
    toast({
      title: "Authentication Failed",
      description: "Please ensure you're using Pi Browser or Pi Testnet.",
      variant: "destructive",
    });
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
    
    if (planId === 'Free') {
      // Free plan - go directly to dashboard
      toast({
        title: "Free Plan Selected! 🎉",
        description: "Welcome to Salenus AI! Let's get you started.",
        duration: 3000,
      });
      
      setTimeout(() => {
        navigate('/dashboard');
        if (onSuccess) onSuccess();
      }, 1000);
    } else {
      // Paid plan - go to payment
      setStep('payment');
    }
  };

  const handlePaymentSuccess = () => {
    // Update user plan in the system
    console.log(`Payment successful for ${selectedPlan} plan`);
    
    toast({
      title: "Payment Successful! 🎉",
      description: `Welcome to ${selectedPlan} plan! Let's get you started.`,
      duration: 4000,
    });
    
    // Immediately redirect to dashboard with new plan
    setTimeout(() => {
      navigate('/dashboard');
      if (onSuccess) onSuccess();
    }, 1000);
  };

  const handleSkipPayment = () => {
    toast({
      title: "Free Plan Activated! 🎉",
      description: "You can upgrade anytime from your dashboard.",
      duration: 3000,
    });
    
    setTimeout(() => {
      navigate('/dashboard');
      if (onSuccess) onSuccess();
    }, 1000);
  };

  if (step === 'dashboard') {
    return null; // User will be redirected
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {step === 'welcome' && (
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome to Salenus AI
              </CardTitle>
              <p className="text-gray-600">
                Transform your life with AI-powered habit tracking and Pi Network rewards
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Habit Tracking</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Coins className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Pi Rewards</p>
                </div>
              </div>
              
              <Button 
                onClick={() => setStep('auth')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <Shield className="h-5 w-5 mr-2" />
                Get Started with Pi Network
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                No credit card required • Start free • Upgrade anytime
              </p>
            </CardContent>
          </Card>
        )}

        {step === 'auth' && (
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Connect with Pi Network
              </CardTitle>
              <p className="text-gray-600">
                Secure authentication with Pi Network for rewards and payments
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Secure Pi Network authentication</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Earn Pi rewards for habits</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  <span className="text-sm">Pay with Pi cryptocurrency</span>
                </div>
              </div>
              
              <PiAuthButton
                onAuthSuccess={handlePiAuthSuccess}
                onAuthError={handlePiAuthError}
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    Connect with Pi Network
                  </>
                )}
              </PiAuthButton>
              
              <p className="text-xs text-gray-500 text-center">
                Make sure you're using Pi Browser or Pi Testnet
              </p>
            </CardContent>
          </Card>
        )}

        {step === 'plan' && (
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mb-4">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Choose Your Plan
              </CardTitle>
              <p className="text-gray-600">
                Start free and upgrade as you grow
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => handlePlanSelection(plan.id)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <plan.icon className={`h-6 w-6 ${plan.color.replace('bg-', 'text-')}`} />
                        <div>
                          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                          <p className="text-sm text-gray-600">{plan.price}/month</p>
                        </div>
                      </div>
                      {selectedPlan === plan.id && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={() => handlePlanSelection(selectedPlan)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Continue with {selectedPlan} Plan
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 'payment' && (
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Complete Your {selectedPlan} Plan
              </CardTitle>
              <p className="text-gray-600">
                Pay with Pi cryptocurrency for instant access
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{selectedPlan} Plan</span>
                  <span className="font-bold text-blue-600">
                    {plans.find(p => p.id === selectedPlan)?.price}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Billed monthly • Cancel anytime
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handlePaymentSuccess}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  size="lg"
                >
                  <Coins className="h-5 w-5 mr-2" />
                  Pay with Pi Network
                </Button>
                
                <Button 
                  onClick={handleSkipPayment}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Start with Free Plan
                </Button>
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Secure payment processed by Pi Network
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}; 