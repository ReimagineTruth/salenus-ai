import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, ArrowUp, ArrowDown, Crown, Star, Zap, Pi } from 'lucide-react';
import { UserPlan } from '@/hooks/useAuth';

const planDetails = {
  Free: {
    price: 'Free',
    features: [
      'Track up to 3 daily habits',
      'Manage up to 10 tasks',
      'Basic notifications',
      'Free habit preview',
      'Pi Network integration',
    ],
    color: 'bg-gray-600',
    icon: <Zap className="h-5 w-5" />,
  },
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
    icon: <Zap className="h-5 w-5" />,
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
    ],
    color: 'bg-indigo-600',
    icon: <Star className="h-5 w-5" />,
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
    icon: <Crown className="h-5 w-5" />,
  },
};

interface PaymentModalProps {
  isOpen: boolean;
  plan: UserPlan;
  onPay: () => Promise<void>;
  onChangePlan: () => void;
  onDowngrade?: (plan: UserPlan) => Promise<void>;
  isLoading: boolean;
  currentPlan?: UserPlan;
  showDowngrade?: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  plan, 
  onPay, 
  onChangePlan, 
  onDowngrade,
  isLoading, 
  currentPlan = 'Free',
  showDowngrade = false 
}) => {
  const [selectedPlan, setSelectedPlan] = useState<UserPlan>(plan);
  const [isDowngrading, setIsDowngrading] = useState(false);
  const [showPiPayment, setShowPiPayment] = useState(false);
  const [piPaymentStep, setPiPaymentStep] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');

  const planHierarchy = { 'Free': 0, 'Basic': 1, 'Pro': 2, 'Premium': 3 };
  // Ensure currentPlan is valid, fallback to 'Free' if undefined or invalid
  const validCurrentPlan = currentPlan && planDetails[currentPlan as keyof typeof planDetails] ? currentPlan : 'Free';
  const currentPlanLevel = planHierarchy[validCurrentPlan] || 0;
  const selectedPlanLevel = planHierarchy[selectedPlan] || 0;
  const isUpgrade = selectedPlanLevel > currentPlanLevel;
  const isDowngrade = selectedPlanLevel < currentPlanLevel;

  const handlePiPayment = async () => {
    setShowPiPayment(true);
    setPiPaymentStep('pending');
    
    // Simulate Pi Network payment flow
    setTimeout(() => {
      setPiPaymentStep('processing');
      
      setTimeout(() => {
        setPiPaymentStep('success');
        
        setTimeout(async () => {
          setShowPiPayment(false);
          setPiPaymentStep('pending');
          await onPay();
        }, 1500);
      }, 2000);
    }, 1000);
  };

  const handleDowngrade = async () => {
    if (!onDowngrade) return;
    
    setIsDowngrading(true);
    try {
      await onDowngrade(selectedPlan);
    } finally {
      setIsDowngrading(false);
    }
  };

  const getPlanComparison = () => {
    // Add null checks and fallbacks
    const currentPlanDetails = planDetails[validCurrentPlan as keyof typeof planDetails] || planDetails.Free;
    const selectedPlanDetails = planDetails[selectedPlan as keyof typeof planDetails] || planDetails.Free;
    
    const currentFeatures = currentPlanDetails.features;
    const selectedFeatures = selectedPlanDetails.features;
    
    const addedFeatures = selectedFeatures.filter(f => !currentFeatures.includes(f));
    const removedFeatures = currentFeatures.filter(f => !selectedFeatures.includes(f));
    
    return { addedFeatures, removedFeatures };
  };

  const { addedFeatures, removedFeatures } = getPlanComparison();

  // Pi Payment Modal
  if (showPiPayment) {
    return (
      <Dialog open={isOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Pi className="h-6 w-6 text-yellow-500" />
              <span>Pi Network Payment</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center space-y-4">
            {piPaymentStep === 'pending' && (
              <>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <Pi className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-yellow-800">Payment Request</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please approve the payment of {planDetails[selectedPlan].price} in your Pi Network app
                  </p>
                </div>
                <Button 
                  onClick={handlePiPayment}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <Pi className="h-4 w-4 mr-2" />
                  Approve Payment
                </Button>
              </>
            )}
            
            {piPaymentStep === 'processing' && (
              <>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-2 animate-spin" />
                  <h3 className="font-semibold text-blue-800">Processing Payment</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Verifying your Pi payment...
                  </p>
                </div>
              </>
            )}
            
            {piPaymentStep === 'success' && (
              <>
                <div className="bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800">Payment Successful!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Your {selectedPlan} plan is now active
                  </p>
                </div>
              </>
            )}
            
            {piPaymentStep === 'error' && (
              <>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="h-12 w-12 text-red-500 mx-auto mb-2">❌</div>
                  <h3 className="font-semibold text-red-800">Payment Failed</h3>
                  <p className="text-sm text-red-700 mt-1">
                    Please try again or contact support
                  </p>
                </div>
                <Button 
                  onClick={() => setShowPiPayment(false)}
                  variant="outline"
                  className="w-full"
                >
                  Try Again
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-800 mb-2">
            {showDowngrade ? 'Change Your Plan' : 'Choose Your Plan'}
          </DialogTitle>
        </DialogHeader>

        {/* Plan Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Object.entries(planDetails).map(([planKey, details]) => {
            const planLevel = planHierarchy[planKey as UserPlan] || 0;
            const isCurrentPlan = planKey === validCurrentPlan;
            const isSelected = planKey === selectedPlan;
            const isDisabled = planLevel === currentPlanLevel;

            return (
              <Card 
                key={planKey}
                className={`cursor-pointer transition-all ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                } ${isDisabled ? 'opacity-50' : ''}`}
                onClick={() => !isDisabled && setSelectedPlan(planKey as UserPlan)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-full ${details.color} text-white`}>
                        {details.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{planKey}</CardTitle>
                        <CardDescription className="text-sm font-semibold">
                          {details.price}
                        </CardDescription>
                      </div>
                    </div>
                    {isCurrentPlan && (
                      <Badge variant="secondary">Current</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-1 text-xs">
                    {details.features.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-center space-x-1 text-gray-600">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="truncate">{feature}</span>
                      </li>
                    ))}
                    {details.features.length > 3 && (
                      <li className="text-gray-500">+{details.features.length - 3} more</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Plan Comparison */}
        {selectedPlan !== validCurrentPlan && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Plan Changes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isUpgrade && addedFeatures.length > 0 && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-800">
                      <ArrowUp className="h-5 w-5" />
                      <span>New Features</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {addedFeatures.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-2 text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              
              {isDowngrade && removedFeatures.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-orange-800">
                      <ArrowDown className="h-5 w-5" />
                      <span>Features You'll Lose</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {removedFeatures.map((feature, i) => (
                        <li key={i} className="flex items-center space-x-2 text-orange-700">
                          <CheckCircle className="h-4 w-4" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onChangePlan} disabled={isLoading || isDowngrading}>
            Cancel
          </Button>
          
          {isUpgrade && (
            <Button 
              onClick={handlePiPayment} 
              className={`${planDetails[selectedPlan].color} text-white`} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Pi className="h-4 w-4 mr-2" />
                  Pay with Pi - {planDetails[selectedPlan].price}
                </>
              )}
            </Button>
          )}
          
          {isDowngrade && onDowngrade && (
            <Button 
              onClick={handleDowngrade} 
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-50" 
              disabled={isDowngrading}
            >
              {isDowngrading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Downgrading...
                </>
              ) : (
                `Downgrade to ${selectedPlan}`
              )}
            </Button>
          )}
        </div>

        {/* Warning for downgrades */}
        {isDowngrade && (
          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <ArrowDown className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-800">Plan Downgrade Warning</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Downgrading will remove access to premium features. Your data will be preserved, 
                  but you may lose access to advanced features and analytics.
                </p>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 