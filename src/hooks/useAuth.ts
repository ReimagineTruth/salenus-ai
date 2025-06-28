import { useState, useEffect } from 'react';

export type UserPlan = 'Basic' | 'Pro' | 'Premium' | null;

export interface User {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  planExpiry: Date;
  isActive: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock login function
  const login = async (email: string, password: string, plan: UserPlan) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      plan,
      planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true
    };
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setIsLoading(false);
    
    return mockUser;
  };

  // Mock logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Mock upgrade plan function
  const upgradePlan = async (newPlan: UserPlan) => {
    if (!user) return;
    
    setIsLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updatedUser: User = {
      ...user,
      plan: newPlan,
      planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsLoading(false);
    
    return updatedUser;
  };

  // Check if user has access to a feature
  const hasFeature = (featureName: string): boolean => {
    if (!user) return false;
    
    const featureAccess: Record<string, UserPlan[]> = {
      // Basic features
      'habit_tracking': ['Basic', 'Pro', 'Premium'],
      'task_management': ['Basic', 'Pro', 'Premium'],
      'community_challenges': ['Basic', 'Pro', 'Premium'],
      'cross_platform_sync': ['Basic', 'Pro', 'Premium'],
      'mobile_app': ['Basic', 'Pro', 'Premium'],
      'basic_notifications': ['Basic', 'Pro', 'Premium'],
      
      // Pro features
      'mood_tracking': ['Pro', 'Premium'],
      'smart_reminders': ['Pro', 'Premium'],
      'advanced_goals': ['Pro', 'Premium'],
      'progress_photos': ['Pro', 'Premium'],
      'custom_challenges': ['Pro', 'Premium'],
      'habit_journal': ['Pro', 'Premium'],
      'streak_protection': ['Pro', 'Premium'],
      'priority_support': ['Pro', 'Premium'],
      
      // Premium features
      'ai_coaching': ['Premium'],
      'advanced_analytics': ['Premium'],
      'calendar_integration': ['Premium'],
      'predictive_insights': ['Premium'],
      'personalized_courses': ['Premium'],
      'api_access': ['Premium'],
      'white_label': ['Premium'],
      'vip_support': ['Premium']
    };
    
    const requiredPlan = featureAccess[featureName];
    if (!requiredPlan) return false;
    
    return requiredPlan.includes(user.plan);
  };

  // Get plan features
  const getPlanFeatures = (plan: UserPlan) => {
    const features = {
      Basic: [
        'habit_tracking',
        'task_management', 
        'community_challenges',
        'cross_platform_sync',
        'mobile_app',
        'basic_notifications'
      ],
      Pro: [
        'habit_tracking',
        'task_management',
        'community_challenges', 
        'cross_platform_sync',
        'mobile_app',
        'basic_notifications',
        'mood_tracking',
        'smart_reminders',
        'advanced_goals',
        'progress_photos',
        'custom_challenges',
        'habit_journal',
        'streak_protection',
        'priority_support'
      ],
      Premium: [
        'habit_tracking',
        'task_management',
        'community_challenges',
        'cross_platform_sync', 
        'mobile_app',
        'basic_notifications',
        'mood_tracking',
        'smart_reminders',
        'advanced_goals',
        'progress_photos',
        'custom_challenges',
        'habit_journal',
        'streak_protection',
        'priority_support',
        'ai_coaching',
        'advanced_analytics',
        'calendar_integration',
        'predictive_insights',
        'personalized_courses',
        'api_access',
        'white_label',
        'vip_support'
      ]
    };
    
    return features[plan] || [];
  };

  // Initialize user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        // Patch planExpiry to be a Date object if it's a string
        if (userData.planExpiry && typeof userData.planExpiry === 'string') {
          userData.planExpiry = new Date(userData.planExpiry);
        }
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  return {
    user,
    isLoading,
    login,
    logout,
    upgradePlan,
    hasFeature,
    getPlanFeatures
  };
}; 