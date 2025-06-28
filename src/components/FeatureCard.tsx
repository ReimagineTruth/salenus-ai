import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Check, ArrowUp, Loader2 } from 'lucide-react';
import { UserPlan } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MockAdModal } from './MockAdModal';

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAd, setShowAd] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Map featureKey to dashboard route
  const featureRoutes: Record<string, string> = {
    habit_tracking: '/dashboard/habits',
    task_management: '/dashboard/tasks',
    community_challenges: '/dashboard/challenges',
    cross_platform_sync: '/dashboard/sync',
    mobile_app: '/dashboard/mobile',
    basic_notifications: '/dashboard/notifications',
    mood_tracking: '/dashboard/mood',
    smart_reminders: '/dashboard/smart-reminders',
    advanced_goals: '/dashboard/goals',
    progress_photos: '/dashboard/photos',
    custom_challenges: '/dashboard/custom-challenges',
    habit_journal: '/dashboard/journal',
    streak_protection: '/dashboard/streak-protection',
    priority_support: '/dashboard/support',
    ai_coaching: '/dashboard/ai-coach',
    advanced_analytics: '/dashboard/analytics',
    calendar_integration: '/dashboard/calendar',
    vip_support: '/dashboard/vip-support',
    exclusive_features: '/dashboard/exclusive',
    personalized_courses: '/dashboard/courses',
    api_access: '/dashboard/api',
    white_label: '/dashboard/white-label',
  };

  const handleTryFeature = () => {
    if (user?.plan === 'Basic') {
      setShowAd(true);
    } else {
      const route = featureRoutes[featureKey];
      if (route) {
        setIsLoading(true);
        // Add loading state
        const featureName = title;
        console.log(`Navigating to ${featureName} at ${route}`);
        
        // Simulate loading time
        setTimeout(() => {
          navigate(route);
          setIsLoading(false);
        }, 1000);
      }
    }
  };

  const handleAdComplete = () => {
    setShowAd(false);
    const route = featureRoutes[featureKey];
    if (route) {
      setIsLoading(true);
      const featureName = title;
      console.log(`Navigating to ${featureName} at ${route} after ad completion`);
      
      setTimeout(() => {
        navigate(route);
        setIsLoading(false);
      }, 1000);
    }
  };

  return (
    <>
      <Card className={`relative transition-all duration-300 hover:shadow-professional-lg feature-card ${
        isLockedFeature 
          ? 'opacity-60 border-slate-200' 
          : 'border-blue-200 shadow-professional hover:-translate-y-1 animate-fade-in-up'
      }`}>
        {isLockedFeature && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <Lock className="h-8 w-8 text-slate-400 mx-auto mb-2 animate-float" />
              <p className="text-sm text-slate-600 mb-2">Upgrade to {requiredPlan}</p>
              <Badge className={`${planColors[requiredPlan]} animate-glow`}>{planPrices[requiredPlan]}</Badge>
            </div>
          </div>
        )}
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg transition-all duration-300 ${isLockedFeature ? 'bg-slate-100' : 'bg-blue-100 hover:bg-blue-200'}`}> 
              <div className={`transition-all duration-300 ${isLockedFeature ? 'text-slate-400' : 'text-blue-600'}`}>
                {icon}
              </div>
            </div>
            {!isLockedFeature && (
              <Badge className="bg-green-100 text-green-800 success-checkmark">
                <Check className="h-3 w-3 mr-1" />
                Available
              </Badge>
            )}
          </div>
          <CardTitle className={`text-lg font-semibold transition-colors duration-300 ${isLockedFeature ? 'text-slate-500' : 'text-slate-800'}`}>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className={`mb-4 transition-colors duration-300 ${isLockedFeature ? 'text-slate-400' : 'text-slate-600'}`}>{description}</CardDescription>
          {isLockedFeature && onUpgrade && (
            <Button 
              onClick={onUpgrade}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white btn-animate"
              size="sm"
            >
              <ArrowUp className="h-4 w-4 mr-2" />
              Upgrade to {requiredPlan}
            </Button>
          )}
          {!isLockedFeature && (
            <div className="flex items-center justify-between">
              <Badge className="bg-blue-100 text-blue-800">{userPlan} Plan</Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleTryFeature}
                disabled={isLoading}
                className="btn-animate hover:bg-blue-50 hover:border-blue-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Try Feature'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <MockAdModal
        isOpen={showAd}
        onClose={() => setShowAd(false)}
        onComplete={handleAdComplete}
      />
    </>
  );
}; 