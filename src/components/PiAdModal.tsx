import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Play, 
  Pause, 
  SkipForward, 
  CheckCircle, 
  Gift, 
  Coins, 
  Target,
  ExternalLink,
  Clock,
  Star,
  Zap
} from 'lucide-react';

interface PiAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdComplete: () => void;
  userPlan?: string;
}

export const PiAdModal: React.FC<PiAdModalProps> = ({
  isOpen,
  onClose,
  onAdComplete,
  userPlan = 'Free'
}) => {
  const [adStep, setAdStep] = useState<'intro' | 'watching' | 'complete' | 'reward'>('intro');
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds ad
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAdStep('intro');
      setTimeRemaining(30);
      setProgress(0);
      setIsPaused(false);
    }
  }, [isOpen]);

  // Timer for ad watching
  useEffect(() => {
    if (adStep === 'watching' && !isPaused && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          setProgress(((30 - newTime) / 30) * 100);
          
          if (newTime <= 0) {
            setAdStep('complete');
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [adStep, isPaused, timeRemaining]);

  const handleStartAd = () => {
    setAdStep('watching');
    toast({
      title: "Ad Started! 📺",
      description: "Please watch the full ad to earn your reward.",
      duration: 3000,
    });
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleSkip = () => {
    toast({
      title: "Ad Skipped",
      description: "You need to watch the full ad to earn rewards.",
      variant: "destructive",
    });
  };

  const handleAdComplete = () => {
    setAdStep('reward');
    toast({
      title: "Ad Completed! 🎉",
      description: "Great job! You've earned your reward.",
      duration: 3000,
    });
  };

  const handleClaimReward = () => {
    // Open the habit tracking app in a new tab
    window.open('https://habittracking8915.pinet.com/', '_blank');
    
    toast({
      title: "Reward Claimed! 🎁",
      description: "Opening Habit Tracking app in new tab...",
      duration: 3000,
    });
    
    onAdComplete();
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full mx-4">
        <DialogHeader>
          <DialogTitle className="text-center">
            {adStep === 'intro' && 'Watch Pi Network Ad'}
            {adStep === 'watching' && 'Watching Ad...'}
            {adStep === 'complete' && 'Ad Completed!'}
            {adStep === 'reward' && 'Claim Your Reward!'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {adStep === 'intro' && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Play className="h-8 w-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Watch Ad to Unlock Habit Tracking
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  As a free user, watch this 30-second Pi Network ad to access the full habit tracking app.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Gift className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">Your Reward:</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    Access to Habit Tracking App
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Duration: 30 seconds</span>
              </div>

              <Button 
                onClick={handleStartAd}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Watching Ad
              </Button>
            </div>
          )}

          {adStep === 'watching' && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                <div className="animate-pulse">
                  <Play className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Pi Network Ad Playing
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Please watch the full ad to earn your reward.
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-xs text-gray-500">Remaining</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={handlePauseResume}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  {isPaused ? <Play className="h-4 w-4 mr-1" /> : <Pause className="h-4 w-4 mr-1" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </Button>
                
                <Button 
                  onClick={handleSkip}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <SkipForward className="h-4 w-4 mr-1" />
                  Skip
                </Button>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">
                    Don't skip! You need to watch the full ad.
                  </span>
                </div>
              </div>
            </div>
          )}

          {adStep === 'complete' && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ad Completed Successfully!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Thank you for watching! You've earned your reward.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Gift className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">Reward Unlocked!</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">
                    Access to Habit Tracking App
                  </span>
                </div>
              </div>

              <Button 
                onClick={() => setAdStep('reward')}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                size="lg"
              >
                <Gift className="h-5 w-5 mr-2" />
                Claim Your Reward
              </Button>
            </div>
          )}

          {adStep === 'reward' && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <Gift className="h-8 w-8 text-white" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Reward is Ready!
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Click below to access the full Habit Tracking app.
                </p>
              </div>

              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-center text-purple-800">
                    <div className="flex items-center justify-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Habit Tracking App</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <p className="text-sm text-purple-700">
                      Track up to 5 daily habits with simple streak counters and basic progress visualization.
                    </p>
                    <div className="flex items-center justify-center space-x-2 text-xs text-purple-600">
                      <Coins className="h-3 w-3" />
                      <span>Powered by Pi Network</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Button 
                  onClick={handleClaimReward}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  <ExternalLink className="h-5 w-5 mr-2" />
                  Open Habit Tracking App
                </Button>
                
                <Button 
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Close
                </Button>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">
                    The app will open in a new tab
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 