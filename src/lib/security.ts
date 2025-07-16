// Security configuration for Salenus AI
export const SecurityConfig = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    serviceRoleKey: import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
    jwtSecret: import.meta.env.SUPABASE_JWT_SECRET,
  },

  // Application Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Salenus AI',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
    environment: import.meta.env.NODE_ENV || 'development',
  },

  // Security Settings
  security: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '52428800'), // 50MB
    allowedFileTypes: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || ['image/*', 'application/pdf', 'text/*'],
  },

  // Feature Flags
  features: {
    realTime: import.meta.env.VITE_ENABLE_REAL_TIME === 'true',
    fileUploads: import.meta.env.VITE_ENABLE_FILE_UPLOADS === 'true',
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },

  // API Configuration
  api: {
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    maxRetries: parseInt(import.meta.env.VITE_MAX_RETRIES || '3'),
    retryDelay: parseInt(import.meta.env.VITE_RETRY_DELAY || '1000'),
  },

  // Development Configuration
  development: {
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  },
};

// Security validation
export const validateSecurityConfig = () => {
  const errors: string[] = [];

  // Check required Supabase configuration
  if (!SecurityConfig.supabase.url) {
    errors.push('VITE_SUPABASE_URL is required');
  }
  if (!SecurityConfig.supabase.anonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is required');
  }

  // Check file size limits
  if (SecurityConfig.security.maxFileSize > 100 * 1024 * 1024) { // 100MB max
    errors.push('VITE_MAX_FILE_SIZE cannot exceed 100MB');
  }

  // Check API timeout
  if (SecurityConfig.api.timeout < 5000 || SecurityConfig.api.timeout > 120000) {
    errors.push('VITE_API_TIMEOUT must be between 5 and 120 seconds');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// File validation
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size
  if (file.size > SecurityConfig.security.maxFileSize) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${SecurityConfig.security.maxFileSize / (1024 * 1024)}MB`,
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
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  return { isValid: true };
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .substring(0, 1000); // Limit length
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
export const validatePassword = (password: string): { isValid: boolean; strength: 'weak' | 'medium' | 'strong'; errors: string[] } => {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score < 3) {
    errors.push('Password must contain at least 3 of: lowercase, uppercase, numbers, symbols');
  }

  let strength: 'weak' | 'medium' | 'strong';
  if (score < 3) strength = 'weak';
  else if (score < 5) strength = 'medium';
  else strength = 'strong';

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
};

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (attempt.count >= this.maxAttempts) {
      return false;
    }

    attempt.count += 1;
    return true;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// CSRF protection
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Session management
export const SessionManager = {
  setSession: (key: string, value: any, expiresIn: number = 3600000): void => {
    const item = {
      value,
      expires: Date.now() + expiresIn,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  getSession: (key: string): any => {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      const parsed = JSON.parse(item);
      if (Date.now() > parsed.expires) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed.value;
    } catch {
      localStorage.removeItem(key);
      return null;
    }
  },

  clearSession: (key: string): void => {
    localStorage.removeItem(key);
  },

  clearAllSessions: (): void => {
    localStorage.clear();
  },
};

// Logging with security considerations
export const SecureLogger = {
  log: (level: 'info' | 'warn' | 'error', message: string, data?: any): void => {
    if (SecurityConfig.development.debugMode) {
      const sanitizedData = data ? JSON.stringify(data).replace(/password|token|key/gi, '[REDACTED]') : '';
      console.log(`[${level.toUpperCase()}] ${message}`, sanitizedData);
    }
  },

  error: (message: string, error?: any): void => {
    if (SecurityConfig.development.debugMode) {
      console.error(`[ERROR] ${message}`, error);
    }
  },
}; 