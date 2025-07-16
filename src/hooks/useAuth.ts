import { useState, useEffect } from 'react';

export type UserPlan = 'Free' | 'Basic' | 'Pro' | 'Premium';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: UserPlan;
  planExpiry: Date | null;
  isActive: boolean;
  createdAt: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Local storage login function
  const login = async (email: string, password: string, plan: UserPlan) => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u: User) => u.email === email);
      
      if (!existingUser) {
        throw new Error('User not found. Please sign up first.');
      }
      
      // Simple password check (in real app, use proper hashing)
      if (existingUser.password !== password) {
        throw new Error('Invalid password.');
      }
      
      // Remove password from user object and ensure proper structure
      const { password: _, ...userData } = existingUser;
      const validatedUser = {
        ...userData,
        plan: userData.plan || 'Free',
        hasPaid: userData.hasPaid || false,
        planExpiry: userData.planExpiry || null,
        isActive: userData.isActive !== false
      };
      
      setUser(validatedUser);
      localStorage.setItem('currentUser', JSON.stringify(validatedUser));
      setIsLoading(false);
      
      return validatedUser;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // Local storage register function
  const register = async (email: string, password: string, name: string, plan: UserPlan = 'Free') => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u: User) => u.email === email);
      
      if (existingUser) {
        throw new Error('User already exists. Please sign in instead.');
      }
      
      // Create new user with proper structure
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        plan,
        planExpiry: null,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      // Add hasPaid field for new users
      const userWithPaymentStatus = {
        ...newUser,
        hasPaid: false
      };
      
      // Save user to localStorage
      users.push({ ...userWithPaymentStatus, password });
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set as current user
      setUser(userWithPaymentStatus);
      localStorage.setItem('currentUser', JSON.stringify(userWithPaymentStatus));
      setIsLoading(false);
      
      return userWithPaymentStatus;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // Local storage logout function
  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Local storage upgrade plan function
  const upgradePlan = async (newPlan: UserPlan) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update user plan with payment status
      const updatedUser = {
        ...user,
        plan: newPlan,
        hasPaid: true,
        planExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      };
      
      // Update in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex] = { 
          ...users[userIndex], 
          plan: newPlan, 
          hasPaid: true,
          planExpiry: updatedUser.planExpiry 
        };
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setIsLoading(false);
      
      return updatedUser;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
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
        'predictive_insights',
        'personalized_courses',
        'api_access',
        'white_label',
        'vip_support'
      ]
    };
    
    return features[plan] || [];
  };

  // Check plan status and handle expired plans
  const checkPlanStatus = () => {
    if (!user) return { isValid: false, isExpired: false, isExpiringSoon: false };
    
    const isExpired = user.planExpiry && new Date(user.planExpiry) < new Date();
    const isExpiringSoon = user.planExpiry && !isExpired && 
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

  // Initialize user from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const savedUser = localStorage.getItem('currentUser');
      
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          if (userData.planExpiry && typeof userData.planExpiry === 'string') {
            userData.planExpiry = new Date(userData.planExpiry);
          }
          
          // Ensure user has required fields
          const validatedUser = {
            ...userData,
            plan: userData.plan || 'Free',
            hasPaid: userData.hasPaid || false,
            planExpiry: userData.planExpiry || null,
            isActive: userData.isActive !== false
          };
          
          setUser(validatedUser);
          
          // Update localStorage with validated data
          localStorage.setItem('currentUser', JSON.stringify(validatedUser));
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('currentUser');
        }
      }
    };

    initializeAuth();
  }, []);

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    upgradePlan,
    hasFeature,
    getPlanFeatures,
    checkPlanStatus,
    getRecommendedPlan
  };
}; 