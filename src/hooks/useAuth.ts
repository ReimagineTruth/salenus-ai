import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SupabaseService } from '@/lib/supabase-service';
import { fixMissingUser } from '@/lib/fix-user';
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

  // Mock authentication for testing
  const useMockAuth = false; // Set to false to use real authentication

  // Initialize auth state
  useEffect(() => {
    try {
      if (useMockAuth) {
        console.log('useAuth: Using MOCK authentication for testing');
        
        // Create a mock user for testing
        const mockUser: AppUser = {
          id: 'mock-user-id',
          email: 'test@salenus.ai',
          name: 'Test User',
          plan: 'Premium' as UserPlan,
          planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          isActive: true,
          createdAt: new Date().toISOString(),
          hasPaid: true,
          avatarUrl: undefined
        };
        
        console.log('useAuth: Setting mock user:', mockUser);
        setUser(mockUser);
        setAuthUser({ id: 'mock-auth-id', email: 'test@salenus.ai' } as User);
        
        // Add a small delay to ensure the user is set
        setTimeout(() => {
          console.log('useAuth: Mock user should now be available');
          console.log('useAuth: Current user state:', user);
        }, 100);
        
        return;
      }

    console.log('useAuth: Initializing authentication...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('useAuth: Initial session check:', session);
      setAuthUser(session?.user ?? null);
      if (session?.user) {
        console.log('useAuth: User found in session, loading data...');
        loadUserData(session.user.id);
      } else {
        console.log('useAuth: No user in session');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: Auth state change:', event, session?.user?.email);
        setAuthUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('useAuth: User signed in, loading data...');
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          console.log('useAuth: User signed out');
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
    } catch (error) {
      console.error('useAuth: Error initializing authentication:', error);
      // Set a fallback user to prevent white screen
      const fallbackUser: AppUser = {
        id: 'fallback-user-id',
        email: 'fallback@salenus.ai',
        name: 'Fallback User',
        plan: 'Free' as UserPlan,
        planExpiry: null,
        isActive: true,
        createdAt: new Date().toISOString(),
        hasPaid: false,
        avatarUrl: undefined
      };
      setUser(fallbackUser);
      setAuthUser({ id: 'fallback-auth-id', email: 'fallback@salenus.ai' } as User);
    }
  }, []);

  const loadUserData = async (authUserId: string) => {
    try {
      console.log('loadUserData: Starting to load user data for authUserId:', authUserId);
      
      // Check if user exists in our database
      let appUser = await SupabaseService.getUser(authUserId);
      console.log('loadUserData: Retrieved user from database:', appUser);
      
      if (!appUser) {
        console.log('loadUserData: User not found in database, attempting to fix...');
        // Try to fix the missing user record
        appUser = await fixMissingUser(authUserId);
        console.log('loadUserData: After fix attempt, user:', appUser);
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
        
        console.log('loadUserData: Setting user state with data:', userData);
        setUser(userData);
      } else {
        console.error('loadUserData: Failed to load or create user data');
        // Create a fallback user to prevent infinite redirects
        const fallbackUser: AppUser = {
          id: authUserId,
          email: 'unknown@user.com',
          name: 'Unknown User',
          plan: 'Free' as UserPlan,
          planExpiry: null,
          isActive: true,
          createdAt: new Date().toISOString(),
          hasPaid: false,
          avatarUrl: undefined
        };
        console.log('loadUserData: Setting fallback user:', fallbackUser);
        setUser(fallbackUser);
      }
    } catch (error) {
      console.error('loadUserData: Error loading user data:', error);
      // Create a fallback user to prevent infinite redirects
      const fallbackUser: AppUser = {
        id: authUserId,
        email: 'error@user.com',
        name: 'Error User',
        plan: 'Free' as UserPlan,
        planExpiry: null,
        isActive: true,
        createdAt: new Date().toISOString(),
        hasPaid: false,
        avatarUrl: undefined
      };
      console.log('loadUserData: Setting fallback user due to error:', fallbackUser);
      setUser(fallbackUser);
    }
  };

  // Sign up with email and password
  const register = async (email: string, password: string, name: string, plan: UserPlan = 'Free') => {
    setIsLoading(true);
    
    try {
      if (useMockAuth) {
        console.log('useAuth: Mock registration for:', email);
        
        // Create mock user
        const mockUser: AppUser = {
          id: 'mock-user-' + Date.now(),
          email,
          name,
          plan,
          planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isActive: true,
          createdAt: new Date().toISOString(),
          hasPaid: plan !== 'Free',
          avatarUrl: undefined
        };
        
        setUser(mockUser);
        setAuthUser({ id: mockUser.id, email } as User);
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { id: mockUser.id, email } as User;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          },
          emailRedirectTo: null,
          // Disable email confirmation - user will be automatically confirmed
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
      if (useMockAuth) {
        console.log('useAuth: Mock login for:', email);
        
        // Create mock user for login
        const mockUser: AppUser = {
          id: 'mock-user-' + Date.now(),
          email,
          name: email.split('@')[0],
          plan: 'Premium' as UserPlan,
          planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isActive: true,
          createdAt: new Date().toISOString(),
          hasPaid: true,
          avatarUrl: undefined
        };
        
        setUser(mockUser);
        setAuthUser({ id: mockUser.id, email } as User);
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { id: mockUser.id, email } as User;
      }

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
      console.log('useAuth: Starting logout...');
      console.log('useAuth: useMockAuth:', useMockAuth);
      console.log('useAuth: Current user before logout:', user);
      
      if (useMockAuth) {
        console.log('useAuth: Mock logout - clearing user state');
        setUser(null);
        setAuthUser(null);
        console.log('useAuth: Mock logout completed');
        return;
      }

      console.log('useAuth: Real logout - calling Supabase signOut');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('useAuth: Logout error:', error);
      } else {
        console.log('useAuth: Real logout completed');
      }
    } catch (error) {
      console.error('useAuth: Logout error:', error);
    }
  };

  // Upgrade plan
  const upgradePlan = async (newPlan: UserPlan) => {
    if (!user) return null;
    
    setIsLoading(true);
    
    try {
      if (useMockAuth) {
        console.log('useAuth: Mock plan upgrade to:', newPlan);
        
        // Update mock user plan
        const updatedUser = {
          ...user,
          plan: newPlan,
          hasPaid: true,
          planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        };
        
        setUser(updatedUser);
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return updatedUser;
      }

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

  // Downgrade plan
  const downgradePlan = async (newPlan: UserPlan) => {
    if (!user) return null;
    
    setIsLoading(true);
    
    try {
      if (useMockAuth) {
        console.log('useAuth: Mock plan downgrade to:', newPlan);
        
        // Update mock user plan
        const updatedUser = {
          ...user,
          plan: newPlan,
          hasPaid: newPlan !== 'Free',
          planExpiry: newPlan === 'Free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        };
        
        setUser(updatedUser);
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return updatedUser;
      }

      const planExpiry = newPlan === 'Free' ? null : new Date();
      if (planExpiry) {
        planExpiry.setDate(planExpiry.getDate() + 30); // 30 days from now
      }

      const updatedUser = await SupabaseService.updateUser(user.id, {
        plan: newPlan,
        has_paid: newPlan !== 'Free',
        plan_expiry: planExpiry?.toISOString() || null
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
      console.error('Downgrade plan error:', error);
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
    downgradePlan,
    hasFeature,
    getPlanFeatures,
    checkPlanStatus,
    getRecommendedPlan
  };
}; 