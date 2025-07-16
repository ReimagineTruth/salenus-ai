import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, UserPlus, LogIn } from 'lucide-react';
import { CookieConsent } from '@/components/CookieConsent';
import { useCookieConsent } from '@/hooks/useCookieConsent';

interface LoginPageProps {
  onLogin?: (userData: any) => void;
  onSignup?: (userData: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSignup }) => {
  const { login, register, isLoading } = useAuth();
  const { hasConsented, acceptCookies, declineCookies } = useCookieConsent();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignupMode) {
      if (!email || !password || !name) {
        return setError('Please enter email, password, and name.');
      }
    } else {
      if (!email || !password) {
        return setError('Please enter email and password.');
      }
    }
    
    try {
      let userData;
      
      if (isSignupMode) {
        // Show cookie consent for new signups
        console.log('Signup mode, hasConsented:', hasConsented);
        if (hasConsented === null) {
          console.log('Showing cookie consent for signup');
          setShowCookieConsent(true);
          return;
        }
        
        userData = await register(email, password, name, 'Free');
        if (onSignup) {
          onSignup(userData);
        }
      } else {
        userData = await login(email, password, 'Free');
        if (onLogin) {
          onLogin(userData);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    }
  };

  const handleCookieAccept = (preferences: any) => {
    acceptCookies(preferences);
    setShowCookieConsent(false);
    
    // Retry the signup after cookie consent
    if (isSignupMode) {
      handleSubmit(new Event('submit') as any);
    }
  };

  const handleCookieDecline = () => {
    declineCookies();
    setShowCookieConsent(false);
    
    // Retry the signup after cookie consent
    if (isSignupMode) {
      handleSubmit(new Event('submit') as any);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-teal-100 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <img src="/logo.png" alt="Salenus A.I Logo" className="h-12 w-12 mx-auto mb-2 rounded-full" />
          <CardTitle className="text-2xl font-bold text-indigo-700 mb-1">Salenus A.I Personal Coach</CardTitle>
          <CardDescription className="mb-2">by <span className="font-semibold">mrwain organization</span></CardDescription>
          <div className="text-xs text-slate-500 mb-2">Need help? <a href="mailto:support@salenus.ai" className="text-indigo-600 underline">support@salenus.ai</a></div>
        </CardHeader>
        <CardContent>
          {/* Mode Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => setIsSignupMode(false)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                !isSignupMode 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </button>
            <button
              onClick={() => setIsSignupMode(true)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                isSignupMode 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignupMode && (
              <div>
                <label className="block mb-1 font-medium">Full Name</label>
                <Input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  placeholder="Enter your full name" 
                />
              </div>
            )}
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" />
            </div>
            <div className="bg-green-50 p-3 rounded text-xs text-green-700 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Real authentication: Create an account or sign in with existing credentials
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
              {isLoading ? (isSignupMode ? 'Creating Account...' : 'Signing In...') : (isSignupMode ? 'Create Account' : 'Sign In')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              {isSignupMode ? 'Create your account to get started' : 'Welcome back to your account'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Cookie Consent Banner */}
      <CookieConsent
        isOpen={showCookieConsent}
        onAccept={handleCookieAccept}
        onDecline={handleCookieDecline}
      />
    </div>
  );
};

export default LoginPage; 