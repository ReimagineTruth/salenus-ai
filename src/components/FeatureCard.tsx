import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Check, ArrowUp } from 'lucide-react';
import { UserPlan } from '@/hooks/useAuth';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  featureKey: string;
  requiredPlan: UserPlan;
  userPlan: UserPlan | null;
  onUpgrade?: () => void;
  isLocked?: boolean;
}

const planColors = {
  Basic: 'bg-blue-600',
  Pro: 'bg-indigo-600',
  Premium: 'bg-purple-600'
};

const planPrices = {
  Basic: '5 Pi',
  Pro: '10 Pi',
  Premium: '15 Pi'
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  featureKey,
  requiredPlan,
  userPlan,
  onUpgrade,
  isLocked = false
}) => {
  const hasAccess = userPlan && ['Basic', 'Pro', 'Premium'].indexOf(userPlan) >= ['Basic', 'Pro', 'Premium'].indexOf(requiredPlan);
  const isLockedFeature = isLocked || !hasAccess;

  return (
    <Card className={`relative transition-all duration-300 hover:shadow-professional-lg ${
      isLockedFeature 
        ? 'opacity-60 border-slate-200' 
        : 'border-blue-200 shadow-professional hover:-translate-y-1'
    }`}>
      {isLockedFeature && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 mb-2">Upgrade to {requiredPlan}</p>
            <Badge className={planColors[requiredPlan]}>{planPrices[requiredPlan]}</Badge>
          </div>
        </div>
      )}
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-lg ${isLockedFeature ? 'bg-slate-100' : 'bg-blue-100'}`}>
            <div className={isLockedFeature ? 'text-slate-400' : 'text-blue-600'}>
              {icon}
            </div>
          </div>
          {!isLockedFeature && (
            <Badge className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              Available
            </Badge>
          )}
        </div>
        <CardTitle className={`text-lg font-semibold ${isLockedFeature ? 'text-slate-500' : 'text-slate-800'}`}>
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <CardDescription className={`mb-4 ${isLockedFeature ? 'text-slate-400' : 'text-slate-600'}`}>
          {description}
        </CardDescription>
        
        {isLockedFeature && onUpgrade && (
          <Button 
            onClick={onUpgrade}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white"
            size="sm"
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Upgrade to {requiredPlan}
          </Button>
        )}
        
        {!isLockedFeature && (
          <div className="flex items-center justify-between">
            <Badge className="bg-blue-100 text-blue-800">
              {userPlan} Plan
            </Badge>
            <Button variant="outline" size="sm">
              Try Feature
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 