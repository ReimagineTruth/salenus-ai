import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface CookieConsentProps {
  isOpen: boolean;
  onAccept: (preferences: CookiePreferences) => void;
  onDecline: () => void;
}

export interface CookiePreferences {
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  necessary: boolean;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  isOpen,
  onAccept,
  onDecline
}) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    analytics: true,
    functional: true,
    marketing: false,
    necessary: true
  });

  const handleAccept = () => {
    onAccept(preferences);
  };

  const handleDecline = () => {
    onDecline();
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      {/* Cookie Consent Banner */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-sm text-gray-700">
            This site uses cookies to enhance your experience, analyze usage patterns, and improve our AI coaching features. 
            By continuing, you agree to our use of cookies for analytics and service improvement.{' '}
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="text-indigo-600 underline hover:text-indigo-700 font-medium"
            >
              Learn more
            </button>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleDecline}
              className="text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>

      {/* Privacy Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Cookie Preferences</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-sm text-gray-600">
              <p className="mb-4">
                We use cookies to enhance your AI coaching experience on Salenus AI. These cookies help us provide personalized coaching, track your progress, and improve our services. You can customize your preferences below.
              </p>
            </div>

            <div className="space-y-4">
              {/* Necessary Cookies */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="necessary"
                      checked={preferences.necessary}
                      disabled
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="necessary" className="text-base font-semibold">
                        Necessary Cookies
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        These cookies are essential for Salenus AI to function properly, including authentication, session management, and core coaching features. They cannot be disabled.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analytics Cookies */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="analytics"
                      checked={preferences.analytics}
                      onCheckedChange={() => togglePreference('analytics')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="analytics" className="text-base font-semibold">
                        Analytics Cookies
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Help us understand how you use Salenus AI to improve our coaching algorithms, track feature usage, and enhance your personalized experience.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Functional Cookies */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="functional"
                      checked={preferences.functional}
                      onCheckedChange={() => togglePreference('functional')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="functional" className="text-base font-semibold">
                        Functional Cookies
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Enable enhanced coaching features and personalization, such as remembering your habit preferences, coaching history, and personalized settings.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Marketing Cookies */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="marketing"
                      checked={preferences.marketing}
                      onCheckedChange={() => togglePreference('marketing')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="marketing" className="text-base font-semibold">
                        Marketing Cookies
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Used to provide personalized coaching recommendations and relevant content based on your interests and usage patterns.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowPrivacyModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onAccept(preferences);
                  setShowPrivacyModal(false);
                }}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}; 