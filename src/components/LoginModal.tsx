import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Check, Key, UserPlus, LogIn, Shield } from 'lucide-react';
import { UserPlan } from '@/hooks/useAuth';
import { PiAuthButton } from './PiAuthButton';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string, plan: UserPlan) => Promise<void>;
  onRegister?: (email: string, password: string, name: string, plan: UserPlan) => Promise<void>;
  isLoading: boolean;
  requirePayment?: boolean;
  onRequirePayment?: (plan: UserPlan) => void;
}

const plans = [
  {
    name: 'Basic' as UserPlan,
    price: '5 Pi',
    features: ['Habit Tracking', 'Task Management', 'Community Challenges', 'Mobile App'],
    color: 'bg-blue-600'
  },
  {
    name: 'Pro' as UserPlan,
    price: '10 Pi',
    features: ['Everything in Basic', 'Mood Tracking', 'Smart Reminders', 'Custom Challenges'],
    color: 'bg-indigo-600'
  },
  {
    name: 'Premium' as UserPlan,
    price: '15 Pi',
    features: ['Everything in Pro', 'AI Coaching', 'Advanced Analytics', 'API Access'],
    color: 'bg-purple-600'
  }
];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  isLoading,
  requirePayment,
  onRequirePayment
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<UserPlan>('Basic');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    if (isSignUp && onRegister) {
      // Sign up - should land on landing page
      await onRegister(email, password, name || email.split('@')[0], selectedPlan);
    } else {
      // Sign in - should go to dashboard
      await onLogin(email, password, selectedPlan);
    }
    
    if (requirePayment && onRequirePayment) {
      onRequirePayment(selectedPlan);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              {isSignUp ? 'Sign Up for Salenus A.I' : 'Sign In to Salenus A.I'}
            </CardTitle>
            <CardDescription>
              {isSignUp ? 'Create your account and choose your plan' : 'Choose your plan and start your journey'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Plan Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Select Your Plan</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedPlan === plan.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setSelectedPlan(plan.name)}
                >
                  {selectedPlan === plan.name && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-blue-500 text-white rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={plan.color}>{plan.name}</Badge>
                      <span className="font-bold text-lg">{plan.price}</span>
                    </div>
                    
                    <ul className="space-y-1 text-sm">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-slate-600">
                          <Check className="h-3 w-3 mr-2 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Login/Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
              />
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-green-700">
                <Key className="h-4 w-4" />
                <span>Real Authentication - Create an account or sign in with existing credentials</span>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-slate-800 hover:bg-slate-700"
              disabled={isLoading}
            >
              {isLoading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : 
                isSignUp ? `Sign Up with ${selectedPlan} Plan` : `Sign In with ${selectedPlan} Plan`}
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
                // You can handle Pi authentication success here
                // For example, auto-login the user or redirect to dashboard
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

            {/* Toggle between Sign In and Sign Up */}
            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={toggleMode}
                className="text-sm text-slate-600 hover:text-slate-800"
              >
                {isSignUp ? (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Already have an account? Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Don't have an account? Sign Up
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 