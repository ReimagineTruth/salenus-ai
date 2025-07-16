import { useState, useEffect } from 'react';
import { CookiePreferences } from '@/components/CookieConsent';

const COOKIE_CONSENT_KEY = 'salenus_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'salenus_cookie_preferences';

export const useCookieConsent = () => {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    analytics: true,
    functional: true,
    marketing: false,
    necessary: true
  });

  // Load consent state from localStorage on mount
  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    
    console.log('Loading cookie consent state:', { savedConsent, savedPreferences });
    
    if (savedConsent) {
      setHasConsented(JSON.parse(savedConsent));
    } else {
      console.log('No saved consent found, will show banner');
    }
    
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const acceptCookies = (newPreferences: CookiePreferences) => {
    setHasConsented(true);
    setPreferences(newPreferences);
    
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences));
  };

  const declineCookies = () => {
    setHasConsented(false);
    localStorage.setItem(COOKIE_CONSENT_KEY, 'false');
  };

  const updatePreferences = (newPreferences: CookiePreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(newPreferences));
  };

  const resetConsent = () => {
    setHasConsented(null);
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_PREFERENCES_KEY);
  };

  return {
    hasConsented,
    preferences,
    acceptCookies,
    declineCookies,
    updatePreferences,
    resetConsent
  };
}; 