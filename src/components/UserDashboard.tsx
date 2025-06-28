import React from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { HabitTracker } from '@/components/features/HabitTracker';
import { TaskManager } from '@/components/features/TaskManager';
import { CommunityChallenges } from '@/components/features/CommunityChallenges';
import { CrossPlatformSync } from '@/components/features/CrossPlatformSync';
import { MobileAppAccess } from '@/components/features/MobileAppAccess';
import { BasicNotifications } from '@/components/features/BasicNotifications';
import { MoodTracker } from '@/components/features/MoodTracker';
import { AICoach } from '@/components/features/AICoach';
import { TestFeature } from '@/components/features/TestFeature';
import { PaymentModal } from '@/components/PaymentModal';
import { useAuth } from '@/hooks/useAuth';
import { FeatureCard } from '@/components/FeatureCard';
import { FeatureLoader } from '@/components/ui/Loader';
import { BarChart3, ClipboardList, Users, Cloud, Smartphone, Bell, Heart, Sparkles, Star, Camera, Trophy, BookOpen, Flame, MessageSquare, PieChart, Calendar, Shield, Lightbulb, GraduationCap, Globe, Settings, Lock } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { PanelLeft } from 'lucide-react';

const allFeatures = [
  // Free
  { title: 'Free Habit Preview', description: 'Preview basic habit tracking with limited features. Upgrade to unlock full functionality.', icon: <BarChart3 className="h-8 w-8" />, featureKey: 'free_habit_preview', requiredPlan: 'Free' },
  { title: 'Pi Network Integration', description: 'Access Pi Network features and earn Pi cryptocurrency through the ecosystem.', icon: <Users className="h-8 w-8" />, featureKey: 'pi_network_integration', requiredPlan: 'Free' },
  // Basic
  { title: 'Basic Habit Tracking', description: 'Track up to 5 daily habits with simple streak counters and basic progress visualization.', icon: <BarChart3 className="h-8 w-8" />, featureKey: 'habit_tracking', requiredPlan: 'Basic' },
  { title: 'Simple Task Management', description: 'Create and manage up to 20 tasks with due dates and basic priority levels.', icon: <ClipboardList className="h-8 w-8" />, featureKey: 'task_management', requiredPlan: 'Basic' },
  { title: 'Community Challenges', description: 'Join public community challenges and view basic leaderboards.', icon: <Users className="h-8 w-8" />, featureKey: 'community_challenges', requiredPlan: 'Basic' },
  { title: 'Cross-Platform Sync', description: 'Sync your data across all your devices with automatic cloud backup.', icon: <Cloud className="h-8 w-8" />, featureKey: 'cross_platform_sync', requiredPlan: 'Basic' },
  { title: 'Mobile App Access', description: 'Access Salenus A.I on iOS and Android with basic offline functionality.', icon: <Smartphone className="h-8 w-8" />, featureKey: 'mobile_app', requiredPlan: 'Basic' },
  { title: 'Basic Notifications', description: 'Simple push notifications for habit reminders and task deadlines.', icon: <Bell className="h-8 w-8" />, featureKey: 'basic_notifications', requiredPlan: 'Basic' },
  // Pro
  { title: 'Mood-Based Suggestions', description: 'Get personalized task and habit recommendations based on your daily mood tracking.', icon: <Heart className="h-8 w-8" />, featureKey: 'mood_tracking', requiredPlan: 'Pro' },
  { title: 'Smart Reminders', description: 'AI-powered reminders that adapt to your schedule and optimal productivity times.', icon: <Bell className="h-8 w-8" />, featureKey: 'smart_reminders', requiredPlan: 'Pro' },
  { title: 'Advanced Goal Setting', description: 'Set complex goals with sub-milestones and automated progress tracking.', icon: <Star className="h-8 w-8" />, featureKey: 'advanced_goals', requiredPlan: 'Pro' },
  { title: 'Progress Photos', description: 'Document your journey with progress photos and visual habit tracking.', icon: <Camera className="h-8 w-8" />, featureKey: 'progress_photos', requiredPlan: 'Pro' },
  { title: 'Custom Challenges', description: 'Create private challenges for friends and track group progress.', icon: <Trophy className="h-8 w-8" />, featureKey: 'custom_challenges', requiredPlan: 'Pro' },
  { title: 'Habit Journal', description: 'Advanced journaling with templates, tags, and reflection prompts.', icon: <BookOpen className="h-8 w-8" />, featureKey: 'habit_journal', requiredPlan: 'Pro' },
  { title: 'Streak Protection', description: 'Protect your streaks with freeze days and recovery modes.', icon: <Flame className="h-8 w-8" />, featureKey: 'streak_protection', requiredPlan: 'Pro' },
  { title: 'Priority Support', description: 'Email support with 24-hour response time and live chat access.', icon: <MessageSquare className="h-8 w-8" />, featureKey: 'priority_support', requiredPlan: 'Pro' },
  // Premium
  { title: 'AI Personal Coach', description: 'Get personalized coaching sessions and detailed performance analysis from our AI.', icon: <Sparkles className="h-8 w-8" />, featureKey: 'ai_coaching', requiredPlan: 'Premium' },
  { title: 'Advanced Analytics', description: 'Deep insights with trend analysis, correlation tracking, and predictive suggestions.', icon: <PieChart className="h-8 w-8" />, featureKey: 'advanced_analytics', requiredPlan: 'Premium' },
  { title: 'Calendar Integration', description: 'Full integration with Google Calendar, Outlook, and Apple Calendar for seamless scheduling.', icon: <Calendar className="h-8 w-8" />, featureKey: 'calendar_integration', requiredPlan: 'Premium' },
  { title: 'VIP Support', description: '24/7 priority customer support with dedicated account manager and phone support.', icon: <Shield className="h-8 w-8" />, featureKey: 'vip_support', requiredPlan: 'Premium' },
  { title: 'Exclusive Features', description: 'Early access to beta features, exclusive workshops, and premium content library.', icon: <Lightbulb className="h-8 w-8" />, featureKey: 'exclusive_features', requiredPlan: 'Premium' },
  { title: 'Personalized Courses', description: 'AI-curated learning paths and skill development courses based on your goals.', icon: <GraduationCap className="h-8 w-8" />, featureKey: 'personalized_courses', requiredPlan: 'Premium' },
  { title: 'API Access', description: 'Developer API access to integrate Salenus A.I with your favorite tools and workflows.', icon: <Globe className="h-8 w-8" />, featureKey: 'api_access', requiredPlan: 'Premium' },
  { title: 'White-Label Options', description: 'Custom branding and white-label solutions for teams and organizations.', icon: <Settings className="h-8 w-8" />, featureKey: 'white_label', requiredPlan: 'Premium' },
];

interface UserDashboardProps {
  user?: any;
  onLogout?: () => void;
  onUpgrade?: (plan: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user, onLogout, onUpgrade }) => {
  const { upgradePlan, isLoading, hasFeature } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();

  const [paymentOpen, setPaymentOpen] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [featureLoading, setFeatureLoading] = React.useState(false);
  const [currentFeature, setCurrentFeature] = React.useState('');

  // Debug logging
  console.log('UserDashboard - User data:', user);
  console.log('UserDashboard - User plan:', user?.plan);
  console.log('UserDashboard - Has paid:', user?.hasPaid);

  // Check if subscription is expired
  const isExpired = user && user.planExpiry && new Date(user.planExpiry) < new Date();

  // Check if subscription is expiring soon (within 7 days)
  const isExpiringSoon = user && user.planExpiry && !isExpired && 
    new Date(user.planExpiry).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;

  // If expired, force payment modal for renewal
  React.useEffect(() => {
    if (isExpired) {
      setSelectedPlan(user.plan);
      setPaymentOpen(true);
    }
  }, [isExpired, user?.plan]);

  // Block dashboard if expired and payment modal is open
  if (isExpired && paymentOpen) {
    return (
      <PaymentModal
        isOpen={paymentOpen}
        plan={selectedPlan}
        onPay={handlePay}
        onChangePlan={handleChangePlan}
        isLoading={featureLoading}
      />
    );
  }

  if (!user) return null;

  // Ensure user has a valid plan
  if (!user.plan) {
    console.error('User has no plan assigned');
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Account Error</h2>
          <p className="text-gray-600">Your account plan information is missing. Please contact support.</p>
        </div>
      </div>
    );
  }

  const handleSignOut = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Check if user has access to a specific plan level
  const hasPlanAccess = (requiredPlan: string) => {
    const planHierarchy = { 'Free': 0, 'Basic': 1, 'Pro': 2, 'Premium': 3 };
    const userPlanLevel = planHierarchy[user.plan] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan] || 0;
    return userPlanLevel >= requiredPlanLevel;
  };

  // For upgrades, call onUpgrade from parent (Index.tsx)
  const handleLockedFeatureClick = (feature: string, minPlan: string) => {
    if (onUpgrade) {
      onUpgrade(minPlan);
      setDrawerOpen(false);
    } else {
      setSelectedPlan(minPlan);
      setPaymentOpen(true);
      setDrawerOpen(false);
    }
  };

  const handlePay = async () => {
    if (!selectedPlan) return;
    await upgradePlan(selectedPlan);
    setPaymentOpen(false);
  };

  const handleChangePlan = () => {
    setPaymentOpen(false);
  };

  // Filter features based on user's plan
  const availableFeatures = allFeatures.filter(feature => hasPlanAccess(feature.requiredPlan));

  // Handle feature navigation with loading
  const handleFeatureNavigation = (featureName: string, route: string) => {
    setFeatureLoading(true);
    setCurrentFeature(featureName);
    
    // Simulate loading time
    setTimeout(() => {
      navigate(route);
      setFeatureLoading(false);
      setCurrentFeature('');
    }, 1500); // 1.5 seconds loading time
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop, Drawer for mobile */}
      {isMobile ? (
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side="left" className="p-0 w-64 max-w-full">
            <Sidebar onLockedFeatureClick={handleLockedFeatureClick} userPlan={user.plan} />
          </SheetContent>
        </Sheet>
      ) : (
        <Sidebar onLockedFeatureClick={handleLockedFeatureClick} userPlan={user.plan} />
      )}
      <main className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                className="mr-3 p-2 rounded hover:bg-slate-100 focus:outline-none"
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
              >
                <PanelLeft className="h-6 w-6 text-slate-700" />
              </button>
            )}
            <span className="text-xl font-bold text-navy-900">Salenus A.I Dashboard</span>
            <span className="ml-3 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold align-middle">{user.plan} Plan</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-700">Welcome, {user.name || user.email}</span>
            <button onClick={handleSignOut} className="px-4 py-2 rounded bg-slate-800 text-white font-semibold hover:bg-slate-700">Sign Out</button>
          </div>
        </div>
        
        {/* Expiring Soon Banner */}
        {isExpiringSoon && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-yellow-800">
                  Your {user.plan} plan expires in {
                    Math.ceil((new Date(user.planExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                  } days
                </span>
              </div>
              <button 
                onClick={() => handleLockedFeatureClick('renew', user.plan)}
                className="text-sm text-yellow-700 hover:text-yellow-900 font-medium bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded-md transition-colors"
              >
                Renew Now →
              </button>
            </div>
          </div>
        )}
        
        {/* Plan Status Banner */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-indigo-800">
                {user.plan} Plan Active - {availableFeatures.length} features unlocked
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Plan Expiration Panel */}
              {user.plan !== 'Free' && user.planExpiry && (
                <div className="bg-white rounded-lg px-4 py-2 border border-indigo-200 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    <div className="text-xs">
                      <div className="font-medium text-indigo-800">
                        {user.planExpiry ? (
                          <>
                            Expires: {new Date(user.planExpiry).toLocaleDateString()}
                            <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                              {(() => {
                                const expiryDate = new Date(user.planExpiry);
                                const now = new Date();
                                const diffTime = expiryDate.getTime() - now.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                
                                if (diffDays <= 0) {
                                  return 'Expired';
                                } else if (diffDays <= 7) {
                                  return `${diffDays} days left`;
                                } else if (diffDays <= 30) {
                                  return `${Math.ceil(diffDays / 7)} weeks left`;
                                } else {
                                  return `${Math.ceil(diffDays / 30)} months left`;
                                }
                              })()}
                            </span>
                          </>
                        ) : (
                          'No expiry date'
                        )}
                      </div>
                      <div className="text-indigo-600">
                        {user.planExpiry ? (
                          (() => {
                            const expiryDate = new Date(user.planExpiry);
                            const now = new Date();
                            const diffTime = expiryDate.getTime() - now.getTime();
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            
                            // Determine billing cycle based on expiry date
                            if (diffDays > 365) {
                              return 'Yearly billing';
                            } else if (diffDays > 30) {
                              return 'Monthly billing';
                            } else {
                              return 'Trial period';
                            }
                          })()
                        ) : (
                          'Free plan'
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Auto-Renewal Status */}
              {user.plan !== 'Free' && user.planExpiry && new Date(user.planExpiry) > new Date() && (
                <div className="bg-green-50 rounded-lg px-3 py-2 border border-green-200 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-xs">
                      <div className="font-medium text-green-800">Auto-renewal enabled</div>
                      <div className="text-green-600">
                        Next renewal: {new Date(user.planExpiry).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {user.plan !== 'Premium' && (
                <button 
                  onClick={() => handleLockedFeatureClick('upgrade', 
                    user.plan === 'Free' ? 'Basic' : 
                    user.plan === 'Basic' ? 'Pro' : 'Premium'
                  )}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Upgrade to {user.plan === 'Free' ? 'Basic' : user.plan === 'Basic' ? 'Pro' : 'Premium'} →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-8">
          {/* Show loading state when navigating */}
          {featureLoading ? (
            <FeatureLoader featureName={currentFeature} />
          ) : (
            <>
              {/* Feature Overview Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Available Features</h2>
                <p className="text-gray-600 mb-6">
                  Based on your {user.plan} plan, you have access to {availableFeatures.length} features.
                </p>
              </div>

              {/* Plan Information Panel */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Plan Details</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.plan === 'Free' ? 'bg-gray-100 text-gray-700' :
                    user.plan === 'Basic' ? 'bg-blue-100 text-blue-700' :
                    user.plan === 'Pro' ? 'bg-purple-100 text-purple-700' :
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {user.plan} Plan
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Plan Status */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Plan Status</h4>
                    <div className="text-sm text-gray-600">
                      {user.plan === 'Free' ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Active (Free)</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              user.planExpiry && new Date(user.planExpiry) > new Date() 
                                ? 'bg-green-500' 
                                : 'bg-red-500'
                            }`}></div>
                            <span>{user.planExpiry && new Date(user.planExpiry) > new Date() ? 'Active' : 'Expired'}</span>
                          </div>
                          {user.planExpiry && (
                            <div className="text-xs text-gray-500">
                              Since: {new Date(user.planExpiry).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Billing Information */}
                  {user.plan !== 'Free' && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Billing Information</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        {user.planExpiry ? (
                          <>
                            <div>
                              <span className="font-medium">Cycle:</span> {
                                (() => {
                                  const expiryDate = new Date(user.planExpiry);
                                  const now = new Date();
                                  const diffTime = expiryDate.getTime() - now.getTime();
                                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                  
                                  if (diffDays > 365) {
                                    return 'Yearly';
                                  } else if (diffDays > 30) {
                                    return 'Monthly';
                                  } else {
                                    return 'Trial';
                                  }
                                })()
                              }
                            </div>
                            <div>
                              <span className="font-medium">Next Payment:</span> {new Date(user.planExpiry).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Price:</span> {
                                (() => {
                                  const expiryDate = new Date(user.planExpiry);
                                  const now = new Date();
                                  const diffTime = expiryDate.getTime() - now.getTime();
                                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                  
                                  if (diffDays > 365) {
                                    return user.plan === 'Basic' ? '50 Pi/year' : 
                                           user.plan === 'Pro' ? '100 Pi/year' : '150 Pi/year';
                                  } else {
                                    return user.plan === 'Basic' ? '5 Pi/month' : 
                                           user.plan === 'Pro' ? '10 Pi/month' : '15 Pi/month';
                                  }
                                })()
                              }
                            </div>
                            
                            {/* Billing Cycle Progress Bar */}
                            {(() => {
                              const expiryDate = new Date(user.planExpiry);
                              const now = new Date();
                              const totalDays = expiryDate.getTime() - now.getTime() > 365 * 24 * 60 * 60 * 1000 ? 365 : 30;
                              const remainingDays = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                              const progressPercentage = Math.max(0, Math.min(100, ((totalDays - remainingDays) / totalDays) * 100));
                              
                              return (
                                <div className="mt-3">
                                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Billing Progress</span>
                                    <span>{Math.round(progressPercentage)}% used</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full transition-all duration-300 ${
                                        progressPercentage > 80 ? 'bg-red-500' :
                                        progressPercentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                      }`}
                                      style={{ width: `${progressPercentage}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {remainingDays > 0 ? `${remainingDays} days remaining` : 'Expired'}
                                  </div>
                                </div>
                              );
                            })()}
                          </>
                        ) : (
                          <div>No billing information</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Plan Benefits */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Plan Benefits</h4>
                    <div className="text-sm text-gray-600">
                      <div className="space-y-1">
                        <div>• {availableFeatures.length} features unlocked</div>
                        <div>• {user.plan === 'Free' ? 'Limited access' : 
                               user.plan === 'Basic' ? 'Basic support' :
                               user.plan === 'Pro' ? 'Priority support' : 'VIP support'}</div>
                        <div>• {user.plan === 'Free' ? 'No sync' : 
                               user.plan === 'Basic' ? 'Basic sync' :
                               user.plan === 'Pro' ? 'Advanced sync' : 'Full sync'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {user.plan === 'Free' ? (
                      'Upgrade to unlock premium features'
                    ) : user.planExpiry && new Date(user.planExpiry) <= new Date() ? (
                      'Your plan has expired. Renew to continue access.'
                    ) : (
                      'Your plan is active and working perfectly'
                    )}
                  </div>
                  <div className="flex space-x-3">
                    {user.plan !== 'Premium' && (
                      <button 
                        onClick={() => handleLockedFeatureClick('upgrade', 
                          user.plan === 'Free' ? 'Basic' : 
                          user.plan === 'Basic' ? 'Pro' : 'Premium'
                        )}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                      >
                        {user.plan === 'Free' ? 'Upgrade Plan' : 
                         user.planExpiry && new Date(user.planExpiry) <= new Date() ? 'Renew Plan' : 'Upgrade'}
                      </button>
                    )}
                    {user.plan !== 'Free' && user.planExpiry && new Date(user.planExpiry) > new Date() && (
                      <button 
                        onClick={() => handleLockedFeatureClick('manage', user.plan)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                      >
                        Manage Plan
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {allFeatures.map(feature => {
                  const isAvailable = hasPlanAccess(feature.requiredPlan);
                  const isLocked = !isAvailable;
                  
                  return (
                    <FeatureCard
                      key={feature.featureKey}
                      title={feature.title}
                      description={feature.description}
                      icon={feature.icon}
                      featureKey={feature.featureKey}
                      requiredPlan={feature.requiredPlan}
                      userPlan={user.plan}
                      isLocked={isLocked}
                      onUpgrade={() => handleLockedFeatureClick(feature.featureKey, feature.requiredPlan)}
                    />
                  );
                })}
              </div>

              {/* Plan-specific routes */}
              <Routes>
                {/* Free Plan Routes */}
                <Route path="free-preview" element={hasPlanAccess('Free') ? <TestFeature featureName="Free Habit Preview" description="Preview basic habit tracking. Upgrade to unlock full functionality." icon={<BarChart3 className="h-8 w-8" />} color="bg-gray-100" /> : <Navigate to="/dashboard" replace />} />
                <Route path="pi-network" element={hasPlanAccess('Free') ? <TestFeature featureName="Pi Network Integration" description="Access Pi Network features and earn Pi cryptocurrency." icon={<Users className="h-8 w-8" />} color="bg-yellow-100" /> : <Navigate to="/dashboard" replace />} />
                
                {/* Basic Plan Routes */}
                <Route path="habits" element={hasPlanAccess('Basic') ? <HabitTracker /> : <Navigate to="/dashboard" replace />} />
                <Route path="tasks" element={hasPlanAccess('Basic') ? <TaskManager /> : <Navigate to="/dashboard" replace />} />
                <Route path="challenges" element={hasPlanAccess('Basic') ? <CommunityChallenges /> : <Navigate to="/dashboard" replace />} />
                <Route path="sync" element={hasPlanAccess('Basic') ? <CrossPlatformSync /> : <Navigate to="/dashboard" replace />} />
                <Route path="mobile" element={hasPlanAccess('Basic') ? <MobileAppAccess /> : <Navigate to="/dashboard" replace />} />
                <Route path="notifications" element={hasPlanAccess('Basic') ? <BasicNotifications /> : <Navigate to="/dashboard" replace />} />
                
                {/* Pro Plan Routes */}
                <Route path="mood" element={hasPlanAccess('Pro') ? <MoodTracker /> : <Navigate to="/dashboard" replace />} />
                <Route path="goals" element={hasPlanAccess('Pro') ? <TestFeature featureName="Advanced Goals" description="Pro feature - Advanced goal setting with milestones" icon={<Star className="h-8 w-8" />} color="bg-purple-100" /> : <Navigate to="/dashboard" replace />} />
                <Route path="journal" element={hasPlanAccess('Pro') ? <TestFeature featureName="Habit Journal" description="Pro feature - Advanced journaling with templates" icon={<BookOpen className="h-8 w-8" />} color="bg-indigo-100" /> : <Navigate to="/dashboard" replace />} />
                <Route path="photos" element={hasPlanAccess('Pro') ? <TestFeature featureName="Progress Photos" description="Pro feature - Progress photos and visual tracking" icon={<Camera className="h-8 w-8" />} color="bg-pink-100" /> : <Navigate to="/dashboard" replace />} />
                <Route path="custom-challenges" element={hasPlanAccess('Pro') ? <TestFeature featureName="Custom Challenges" description="Pro feature - Create private challenges for friends" icon={<Trophy className="h-8 w-8" />} color="bg-orange-100" /> : <Navigate to="/dashboard" replace />} />
                <Route path="streak-protection" element={hasPlanAccess('Pro') ? <TestFeature featureName="Streak Protection" description="Pro feature - Protect your streaks with freeze days" icon={<Flame className="h-8 w-8" />} color="bg-red-100" /> : <Navigate to="/dashboard" replace />} />
                <Route path="smart-reminders" element={hasPlanAccess('Pro') ? <TestFeature featureName="Smart Reminders" description="Pro feature - AI-powered adaptive reminders" icon={<Bell className="h-8 w-8" />} color="bg-green-100" /> : <Navigate to="/dashboard" replace />} />
                <Route path="support" element={hasPlanAccess('Pro') ? <TestFeature featureName="Priority Support" description="Pro feature - Email support with 24-hour response" icon={<MessageSquare className="h-8 w-8" />} color="bg-blue-100" /> : <Navigate to="/dashboard" replace />} />
                
                {/* Premium Plan Routes */}
                <Route path="ai-coach" element={hasPlanAccess('Premium') ? <AICoach /> : <Navigate to="/dashboard" replace />} />
                <Route path="analytics" element={hasPlanAccess('Premium') ? <TestFeature featureName="Advanced Analytics" description="Premium feature - Deep insights and predictive analytics" icon={<PieChart className="h-8 w-8" />} color="bg-indigo-100" /> : <Navigate to="/dashboard" replace />} />
                <Route path="calendar" element={hasPlanAccess('Premium') ? <TestFeature featureName="Calendar Integration" description="Premium feature - Full calendar integration" icon={<Calendar className="h-8 w-8" />} color="bg-purple-100" /> : <Navigate to="/dashboard" replace />} />
                <Route path="vip-support" element={hasPlanAccess('Premium') ? <TestFeature featureName="VIP Support" description="Premium feature - 24/7 priority support with dedicated manager" icon={<Shield className="h-8 w-8" />} color="bg-yellow-100" /> : <Navigate to="/dashboard" replace />} />
                <Route path="exclusive" element={hasPlanAccess('Premium') ? <TestFeature featureName="Exclusive Features" description="Premium feature - Early access to beta features" icon={<Lightbulb className="h-8 w-8" />} color="bg-pink-100" /> : <Navigate to="/dashboard" replace />} />
                <Route path="courses" element={hasPlanAccess('Premium') ? <TestFeature featureName="Personalized Courses" description="Premium feature - AI-curated learning paths" icon={<GraduationCap className="h-8 w-8" />} color="bg-green-100" /> : <Navigate to="/dashboard" replace />} />
                <Route path="api" element={hasPlanAccess('Premium') ? <TestFeature featureName="API Access" description="Premium feature - Developer API access" icon={<Globe className="h-8 w-8" />} color="bg-blue-100" /> : <Navigate to="/dashboard" replace />} />
                <Route path="white-label" element={hasPlanAccess('Premium') ? <TestFeature featureName="White-Label Options" description="Premium feature - Custom branding solutions" icon={<Settings className="h-8 w-8" />} color="bg-gray-100" /> : <Navigate to="/dashboard" replace />} />
                
                {/* Default route based on user plan */}
                <Route path="*" element={
                  user.plan === 'Free' ? <Navigate to="free-preview" replace /> :
                  user.plan === 'Basic' ? <Navigate to="habits" replace /> :
                  user.plan === 'Pro' ? <Navigate to="habits" replace /> :
                  user.plan === 'Premium' ? <Navigate to="habits" replace /> :
                  <Navigate to="habits" replace />
                } />
              </Routes>
            </>
          )}
        </div>
      </main>
      {/* Only show PaymentModal for expiry/renewal, not for upgrades (handled by parent) */}
      {!onUpgrade && (
        <PaymentModal
          isOpen={paymentOpen}
          plan={selectedPlan}
          onPay={handlePay}
          onChangePlan={handleChangePlan}
          isLoading={featureLoading}
        />
      )}
    </div>
  );
}; 