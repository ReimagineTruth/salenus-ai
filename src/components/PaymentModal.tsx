import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2 } from 'lucide-react';
import { UserPlan } from '@/hooks/useAuth';

const planDetails = {
  Basic: {
    price: '5 Pi',
    features: [
      'Track up to 5 daily habits',
      'Manage up to 20 tasks',
      'Join community challenges',
      'Cross-platform sync',
      'Mobile app access',
      'Basic notifications',
    ],
    color: 'bg-blue-600',
  },
  Pro: {
    price: '10 Pi',
    features: [
      'Everything in Basic',
      'Mood-based suggestions',
      'Smart reminders',
      'Advanced goal setting',
      'Progress photos',
      'Custom challenges',
      'Habit journal',
      'Streak protection',
      'Priority support',
      'Advanced analytics',
    ],
    color: 'bg-indigo-600',
  },
  Premium: {
    price: '15 Pi',
    features: [
      'Everything in Pro',
      'AI Personal Coach',
      'Advanced analytics',
      'Calendar integration',
      'Predictive insights',
      'Personalized courses',
      'API access',
      'White-label options',
      'VIP support',
      'Early access to features',
    ],
    color: 'bg-purple-600',
  },
};

interface PaymentModalProps {
  isOpen: boolean;
  plan: UserPlan;
  onPay: () => Promise<void>;
  onChangePlan: () => void;
  isLoading: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, plan, onPay, onChangePlan, isLoading }) => {
  if (!plan) return null;
  const details = planDetails[plan];

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800 mb-2">Confirm Your Plan</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-3 mb-4">
          <Badge className={details.color}>{plan}</Badge>
          <span className="text-lg font-semibold">{details.price} / month</span>
        </div>
        <ul className="mb-6 space-y-2">
          {details.features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-slate-700">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onChangePlan} disabled={isLoading}>
            Change Plan
          </Button>
          <Button onClick={onPay} className={details.color + ' text-white'} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            {isLoading ? 'Processing...' : `Pay ${details.price}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 