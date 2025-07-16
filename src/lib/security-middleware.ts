import { supabase } from './supabase';
import { SecurityConfig, validateSecurityConfig, sanitizeInput, isValidEmail, validatePassword } from './security';

// Security middleware for API calls
export class SecurityMiddleware {
  private static instance: SecurityMiddleware;
  private rateLimiters: Map<string, any> = new Map();

  static getInstance(): SecurityMiddleware {
    if (!SecurityMiddleware.instance) {
      SecurityMiddleware.instance = new SecurityMiddleware();
    }
    return SecurityMiddleware.instance;
  }

  // Validate environment configuration
  initialize(): { success: boolean; errors: string[] } {
    const validation = validateSecurityConfig();
    if (!validation.isValid) {
      console.error('Security configuration validation failed:', validation.errors);
      return { success: false, errors: validation.errors };
    }
    return { success: true, errors: [] };
  }

  // Sanitize user inputs
  sanitizeUserInput(input: any): any {
    if (typeof input === 'string') {
      return sanitizeInput(input);
    }
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        sanitized[key] = this.sanitizeUserInput(value);
      }
      return sanitized;
    }
    return input;
  }

  // Validate user session
  async validateSession(): Promise<{ isValid: boolean; user?: any; error?: string }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        return { isValid: false, error: error.message };
      }

      if (!session) {
        return { isValid: false, error: 'No active session' };
      }

      // Check if session is expired
      const now = Date.now() / 1000;
      if (session.expires_at && session.expires_at < now) {
        return { isValid: false, error: 'Session expired' };
      }

      return { isValid: true, user: session.user };
    } catch (error) {
      return { isValid: false, error: 'Session validation failed' };
    }
  }

  // Rate limiting for API calls
  checkRateLimit(identifier: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const key = `rate_limit_${identifier}`;
    const now = Date.now();
    
    if (!this.rateLimiters.has(key)) {
      this.rateLimiters.set(key, { count: 0, resetTime: now + windowMs });
    }

    const limiter = this.rateLimiters.get(key);
    
    if (now > limiter.resetTime) {
      limiter.count = 0;
      limiter.resetTime = now + windowMs;
    }

    if (limiter.count >= maxAttempts) {
      return false;
    }

    limiter.count += 1;
    return true;
  }

  // Validate file uploads
  validateFileUpload(file: File): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > SecurityConfig.security.maxFileSize) {
      return {
        isValid: false,
        error: `File size exceeds maximum allowed size of ${SecurityConfig.security.maxFileSize / (1024 * 1024)}MB`
      };
    }

    // Check file type
    const allowedTypes = SecurityConfig.security.allowedFileTypes;
    const isValidType = allowedTypes.some(type => {
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isValidType) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    return { isValid: true };
  }

  // Validate user registration data
  validateRegistrationData(data: {
    email: string;
    password: string;
    name: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate email
    if (!isValidEmail(data.email)) {
      errors.push('Invalid email address');
    }

    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }

    // Validate name
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (data.name && data.name.length > 50) {
      errors.push('Name cannot exceed 50 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate habit data
  validateHabitData(data: {
    name: string;
    description?: string;
    category: string;
    goal?: number;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length < 1) {
      errors.push('Habit name is required');
    }

    if (data.name && data.name.length > 100) {
      errors.push('Habit name cannot exceed 100 characters');
    }

    if (data.description && data.description.length > 500) {
      errors.push('Description cannot exceed 500 characters');
    }

    if (!data.category || data.category.trim().length < 1) {
      errors.push('Category is required');
    }

    if (data.goal && (data.goal < 1 || data.goal > 100)) {
      errors.push('Goal must be between 1 and 100');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate task data
  validateTaskData(data: {
    title: string;
    description?: string;
    category: string;
    priority?: string;
    dueDate?: string;
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.title || data.title.trim().length < 1) {
      errors.push('Task title is required');
    }

    if (data.title && data.title.length > 200) {
      errors.push('Task title cannot exceed 200 characters');
    }

    if (data.description && data.description.length > 1000) {
      errors.push('Description cannot exceed 1000 characters');
    }

    if (!data.category || data.category.trim().length < 1) {
      errors.push('Category is required');
    }

    if (data.priority && !['Low', 'Medium', 'High', 'Urgent'].includes(data.priority)) {
      errors.push('Invalid priority level');
    }

    if (data.dueDate) {
      const dueDate = new Date(data.dueDate);
      if (isNaN(dueDate.getTime())) {
        errors.push('Invalid due date format');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Check user permissions for features
  checkFeatureAccess(userPlan: string, feature: string): boolean {
    const featureAccess: Record<string, string[]> = {
      'habit_tracking': ['Free', 'Basic', 'Pro', 'Premium'],
      'task_management': ['Free', 'Basic', 'Pro', 'Premium'],
      'basic_notifications': ['Free', 'Basic', 'Pro', 'Premium'],
      'community_challenges': ['Basic', 'Pro', 'Premium'],
      'cross_platform_sync': ['Basic', 'Pro', 'Premium'],
      'mobile_app': ['Basic', 'Pro', 'Premium'],
      'mood_tracking': ['Pro', 'Premium'],
      'smart_reminders': ['Pro', 'Premium'],
      'advanced_goals': ['Pro', 'Premium'],
      'progress_photos': ['Pro', 'Premium'],
      'custom_challenges': ['Pro', 'Premium'],
      'habit_journal': ['Pro', 'Premium'],
      'streak_protection': ['Pro', 'Premium'],
      'priority_support': ['Pro', 'Premium'],
      'ai_coaching': ['Premium'],
      'advanced_analytics': ['Premium'],
      'calendar_integration': ['Premium'],
      'personalized_courses': ['Premium'],
      'api_access': ['Premium'],
      'white_label': ['Premium'],
      'vip_support': ['Premium'],
      'exclusive_features': ['Premium']
    };

    const allowedPlans = featureAccess[feature];
    return allowedPlans ? allowedPlans.includes(userPlan) : false;
  }

  // Generate secure tokens
  generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Encrypt sensitive data (basic implementation)
  encryptData(data: string): string {
    // In a real application, use a proper encryption library
    return btoa(encodeURIComponent(data));
  }

  // Decrypt sensitive data (basic implementation)
  decryptData(encryptedData: string): string {
    // In a real application, use a proper encryption library
    return decodeURIComponent(atob(encryptedData));
  }

  // Log security events
  logSecurityEvent(event: string, details?: any): void {
    if (SecurityConfig.development.debugMode) {
      console.log(`[SECURITY] ${event}`, details);
    }
    
    // In production, send to security monitoring service
    // Example: sendToSecurityMonitoring(event, details);
  }

  // Clean up sensitive data
  cleanup(): void {
    this.rateLimiters.clear();
  }
}

// Export singleton instance
export const securityMiddleware = SecurityMiddleware.getInstance(); 