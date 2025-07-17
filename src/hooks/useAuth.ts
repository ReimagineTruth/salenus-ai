import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SupabaseService } from '@/lib/supabase-service';
import type { User } from '@supabase/supabase-js';

export type UserPlan = 'Free' | 'Basic' | 'Pro' | 'Premium';

export interface AppUser {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  planExpiry: Date | null;
  isActive: boolean;
  createdAt: string;
  hasPaid: boolean;
  avatarUrl?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (authUserId: string) => {
    try {
      console.log('Loading user data for authUserId:', authUserId);
      
      // Check if user exists in our database
      let appUser = await SupabaseService.getUser(authUserId);
      console.log('Retrieved user from database:', appUser);
      
      if (!appUser) {
        console.log('User not found in database, creating new user...');
        // Create new user if they don't exist
        const authUser = await supabase.auth.getUser();
        if (authUser.data.user) {
          console.log('Creating new user with data:', {
            email: authUser.data.user.email,
            name: authUser.data.user.user_metadata?.full_name || authUser.data.user.email!.split('@')[0],
            plan: 'Free',
            authUserId: authUserId
          });
          
          appUser = await SupabaseService.createUser({
            email: authUser.data.user.email!,
            name: authUser.data.user.user_metadata?.full_name || authUser.data.user.email!.split('@')[0],
            plan: 'Free',
            authUserId: authUserId
          });
          console.log('Created new user:', appUser);
        }
      }

      if (appUser) {
        const userData = {
          id: appUser.id,
          email: appUser.email,
          name: appUser.name,
          plan: appUser.plan as UserPlan,
          planExpiry: appUser.plan_expiry ? new Date(appUser.plan_expiry) : null,
          isActive: appUser.is_active,
          createdAt: appUser.created_at,
          hasPaid: appUser.has_paid,
          avatarUrl: appUser.avatar_url || undefined
        };
        
        console.log('Setting user state with data:', userData);
        setUser(userData);
      } else {
        console.error('Failed to load or create user data');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Sign up with email and password
  const register = async (email: string, password: string, name: string, plan: UserPlan = 'Free') => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // User will be created in loadUserData when auth state changes
        return data.user;
      }

      return null;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with email and password
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Upgrade plan
  const upgradePlan = async (newPlan: UserPlan) => {
    if (!user) return null;
    
    setIsLoading(true);
    
    try {
      const planExpiry = new Date();
      planExpiry.setDate(planExpiry.getDate() + 30); // 30 days from now

      const updatedUser = await SupabaseService.updateUser(user.id, {
        plan: newPlan,
        has_paid: true,
        plan_expiry: planExpiry.toISOString()
      });

      if (updatedUser) {
        setUser({
          ...user,
          plan: updatedUser.plan as UserPlan,
          planExpiry: updatedUser.plan_expiry ? new Date(updatedUser.plan_expiry) : null,
          hasPaid: updatedUser.has_paid
        });
      }

      return updatedUser;
    } catch (error) {
      console.error('Upgrade plan error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user has access to a feature
  const hasFeature = (featureName: string): boolean => {
    if (!user) return false;
    
    const featureAccess: Record<string, UserPlan[]> = {
      // Free features
      'habit_tracking': ['Free', 'Basic', 'Pro', 'Premium'],
      'task_management': ['Free', 'Basic', 'Pro', 'Premium'],
      'basic_notifications': ['Free', 'Basic', 'Pro', 'Premium'],
      
      // Basic features
      'community_challenges': ['Basic', 'Pro', 'Premium'],
      'cross_platform_sync': ['Basic', 'Pro', 'Premium'],
      'mobile_app': ['Basic', 'Pro', 'Premium'],
      
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
      'personalized_courses': ['Premium'],
      'api_access': ['Premium'],
      'white_label': ['Premium'],
      'vip_support': ['Premium'],
      'exclusive_features': ['Premium']
    };
    
    const requiredPlan = featureAccess[featureName];
    if (!requiredPlan) return false;
    
    return requiredPlan.includes(user.plan);
  };

  // Get plan features
  const getPlanFeatures = (plan: UserPlan) => {
    const features = {
      Free: [
        'habit_tracking',
        'task_management',
        'basic_notifications'
      ],
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
        'personalized_courses',
        'api_access',
        'white_label',
        'vip_support',
        'exclusive_features'
      ]
    };
    
    return features[plan] || [];
  };

  // Check plan status and handle expired plans
  const checkPlanStatus = () => {
    if (!user) return { isValid: false, isExpired: false, isExpiringSoon: false };
    
    const isExpired = user.plan !== 'Free' && user.planExpiry && new Date(user.planExpiry) < new Date();
    const isExpiringSoon = user.plan !== 'Free' && user.planExpiry && !isExpired && 
      new Date(user.planExpiry).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;
    
    return {
      isValid: !isExpired,
      isExpired,
      isExpiringSoon,
      daysUntilExpiry: user.planExpiry ? Math.ceil((new Date(user.planExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null
    };
  };

  // Get recommended plan based on user behavior
  const getRecommendedPlan = () => {
    if (!user) return 'Free';
    
    // Simple recommendation logic based on current plan
    const planHierarchy = { 'Free': 0, 'Basic': 1, 'Pro': 2, 'Premium': 3 };
    const currentPlanLevel = planHierarchy[user.plan] || 0;
    
    if (currentPlanLevel < 3) {
      const nextPlan = Object.keys(planHierarchy).find(key => planHierarchy[key as UserPlan] === currentPlanLevel + 1);
      return nextPlan as UserPlan || 'Free';
    }
    
    return user.plan;
  };

  return {
    user,
    authUser,
    isLoading,
    register,
    login,
    logout,
    upgradePlan,
    hasFeature,
    getPlanFeatures,
    checkPlanStatus,
    getRecommendedPlan
  };
}; 