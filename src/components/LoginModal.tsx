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

  // Remove or comment out the email/password form and submit button
  // Only show PiAuthButton for sign in
  return (
    isOpen ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In with Pi Network</h2>
          {/* Pi Network Authentication Only */}
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
        </div>
      </div>
    ) : null
  );
}; 