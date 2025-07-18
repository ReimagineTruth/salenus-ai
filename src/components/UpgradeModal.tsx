import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Sparkles, 
  BarChart3, 
  Users, 
  Smartphone, 
  Brain, 
  Calendar,
  CheckCircle,
  ArrowRight,
  Zap,
  Star,
  Trophy
} from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan?: string;
}

const plans = [
  {
    name: 'Basic',
    price: '5 Pi',
    period: 'month',
    icon: <Sparkles className="h-6 w-6" />,
    color: 'bg-blue-500',
    features: [
      '5 habits (instead of 2)',
      'Task management',
      'Mobile app access',
      'Community challenges',
      'Cross-platform sync',
      'Basic notifications'
    ],
    popular: false
  },
  {
    name: 'Pro',
    price: '10 Pi',
    period: 'month',
    icon: <Crown className="h-6 w-6" />,
    color: 'bg-purple-500',
    features: [
      'Unlimited habits',
      'AI coaching',
      'Advanced analytics',
      'Mood tracking',
      'Smart reminders',
      'Progress photos',
      'Custom challenges',
      'Priority support'
    ],
    popular: true
  },
  {
    name: 'Premium',
    price: '15 Pi',
    period: 'month',
    icon: <Trophy className="h-6 w-6" />,
    color: 'bg-yellow-500',
    features: [
      'Everything in Pro',
      'VIP support',
      'Calendar integration',
      'Personalized courses',
      'API access',
      'White-label options',
      'Exclusive features',
      'Dedicated manager'
    ],
    popular: false
  }
];

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  isOpen, 
  onClose, 
  currentPlan = 'Free' 
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { upgradePlan } = useAuth();
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    if (!selectedPlan) {
      toast({
        title: "Select a Plan",
        description: "Please choose a plan to upgrade to.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Show processing message
      toast({
        title: "Processing Upgrade...",
        description: `Upgrading to ${selectedPlan} plan...`,
        duration: 2000,
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Upgrade the plan
      await upgradePlan(selectedPlan as any);

      // Show success message
      toast({
        title: "Upgrade Successful! 🎉",
        description: `Welcome to ${selectedPlan}! You now have access to all premium features.`,
        duration: 4000,
      });

      // Close modal and redirect to dashboard
      onClose();
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      console.error('Upgrade error:', error);
      toast({
        title: "Upgrade Failed",
        description: "There was an error processing your upgrade. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="text-center mb-4">
            <img src="/logo.png" alt="Salenus A.I Logo" className="h-12 w-12 rounded-full mx-auto mb-3" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            🚀 Ready to Level Up?
          </DialogTitle>
          <p className="text-center text-gray-600">
            You've been doing great! Unlock more features to accelerate your progress.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Progress */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <h3 className="font-semibold text-green-800">Great Progress!</h3>
                <p className="text-sm text-green-600">
                  You've been using Salenus AI effectively. Time to unlock more power!
                </p>
              </div>
            </div>
          </div>

          {/* Plan Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card 
                key={plan.name}
                className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedPlan === plan.name 
                    ? 'ring-2 ring-purple-500 bg-purple-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedPlan(plan.name)}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <div className={`mx-auto w-12 h-12 ${plan.color} rounded-full flex items-center justify-center text-white mb-3`}>
                    {plan.icon}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-center justify-center space-x-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Value Proposition */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-indigo-800 mb-2">Why Upgrade?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Track unlimited habits and goals</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-purple-500" />
                <span>Get AI-powered coaching</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <span>Advanced analytics and insights</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-500" />
                <span>Join exclusive community</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleUpgrade}
              disabled={!selectedPlan || isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4" />
                  <span>Upgrade to {selectedPlan || 'Selected Plan'}</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
            
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Maybe Later
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="text-center text-xs text-gray-500">
            <p>🔒 Secure payment • 💰 30-day money-back guarantee • 📱 Works on all devices</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 