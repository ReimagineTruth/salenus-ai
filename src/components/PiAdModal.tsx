import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Clock, 
  Sparkles,
  Pi,
  CheckCircle,
  X,
  ExternalLink,
  AlertCircle,
  UserCheck
} from 'lucide-react';

interface PiAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  adType?: 'video' | 'banner' | 'interactive';
  isPiPioneer?: boolean;
}

interface AdData {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: 'video' | 'banner' | 'interactive';
  sponsor: string;
  image: string;
  cta: string;
}

const mockAds: AdData[] = [
  {
    id: '1',
    title: 'Pi Network - Build Your Future',
    description: 'Join millions of pioneers building the world\'s most inclusive digital currency. Mine Pi on your phone, earn rewards, and be part of the future of money.',
    duration: 30,
    type: 'video',
    sponsor: 'Pi Network',
    image: '/logo.png',
    cta: 'Join Pi Network'
  },
  {
    id: '2',
    title: 'Pi Browser - Your Gateway to Web3',
    description: 'Experience the decentralized web with Pi Browser. Access dApps, manage your Pi wallet, and explore the future of the internet.',
    duration: 15,
    type: 'banner',
    sponsor: 'Pi Network',
    image: '/logo.png',
    cta: 'Download Pi Browser'
  },
  {
    id: '3',
    title: 'Pi Apps - Discover Amazing Apps',
    description: 'Explore the Pi ecosystem with thousands of apps built by the community. From games to productivity tools, find your next favorite app.',
    duration: 20,
    type: 'interactive',
    sponsor: 'Pi Network',
    image: '/logo.png',
    cta: 'Browse Pi Apps'
  },
  {
    id: '4',
    title: 'Pi KYC - Verify Your Identity',
    description: 'Complete your KYC to unlock full Pi Network features. Join the verified community and access exclusive benefits.',
    duration: 25,
    type: 'video',
    sponsor: 'Pi Network',
    image: '/logo.png',
    cta: 'Start KYC Process'
  },
  {
    id: '5',
    title: 'Pi Node - Run a Node, Earn Rewards',
    description: 'Contribute to the Pi Network by running a node. Help secure the network and earn additional Pi rewards.',
    duration: 18,
    type: 'banner',
    sponsor: 'Pi Network',
    image: '/logo.png',
    cta: 'Set Up Pi Node'
  }
];

export const PiAdModal: React.FC<PiAdModalProps> = ({ 
  isOpen, 
  onClose, 
  onComplete, 
  adType = 'video',
  isPiPioneer = false
}) => {
  const [currentAd, setCurrentAd] = useState<AdData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showPioneerPrompt, setShowPioneerPrompt] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Check if user is Pi Pioneer
      if (!isPiPioneer) {
        setShowPioneerPrompt(true);
        return;
      }

      // Select a random ad of the specified type
      const availableAds = mockAds.filter(ad => ad.type === adType);
      const randomAd = availableAds[Math.floor(Math.random() * availableAds.length)];
      setCurrentAd(randomAd);
      setTimeRemaining(randomAd.duration);
      setProgress(0);
      setIsPlaying(false);
      setIsCompleted(false);
      setCanSkip(false);
      setShowPioneerPrompt(false);
    }
  }, [isOpen, adType, isPiPioneer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          const newProgress = ((currentAd?.duration || 0) - newTime) / (currentAd?.duration || 1) * 100;
          setProgress(newProgress);
          
          // Allow skip after 5 seconds
          if (newTime <= (currentAd?.duration || 0) - 5) {
            setCanSkip(true);
          }
          
          if (newTime <= 0) {
            setIsCompleted(true);
            setIsPlaying(false);
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, currentAd]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleSkip = () => {
    if (canSkip) {
      setIsCompleted(true);
      setIsPlaying(false);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleJoinPiNetwork = () => {
    window.open('https://minepi.com/Wain2020', '_blank');
    onClose();
  };

  // Show Pi Pioneer prompt if user is not a pioneer
  if (showPioneerPrompt) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Pi className="h-6 w-6 text-yellow-500" />
                <DialogTitle className="text-xl font-bold">Join Pi Network First</DialogTitle>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pi Pioneer Required</h3>
              <p className="text-gray-600 mb-4">
                To access the free habit tracker, you need to be a Pi Network pioneer. Join millions of users mining Pi cryptocurrency on their phones.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Why Pi Network?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Mine cryptocurrency on your phone</li>
                  <li>• No battery drain or data usage</li>
                  <li>• Free to join and mine</li>
                  <li>• Join the future of digital currency</li>
                </ul>
              </div>

              <Button 
                onClick={handleJoinPiNetwork}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Pi Network
              </Button>

              <p className="text-xs text-gray-500 text-center">
                After joining Pi Network, return here to access the free habit tracker
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!currentAd) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Pi className="h-6 w-6 text-yellow-500" />
              <DialogTitle className="text-xl font-bold">Pi Network Ad</DialogTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Pi Pioneer
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="relative">
          {/* Ad Content */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
            <div className="text-center mb-6">
              <img 
                src={currentAd.image} 
                alt={currentAd.sponsor}
                className="h-16 w-16 mx-auto mb-4 rounded-full"
              />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentAd.title}</h3>
              <p className="text-gray-600 mb-4">{currentAd.description}</p>
              
              {/* Video Player Simulation */}
              <div className="relative bg-black rounded-lg overflow-hidden mb-4">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    {!isPlaying ? (
                      <div className="space-y-4">
                        <div className="text-6xl">📱</div>
                        <div className="text-xl font-semibold">Pi Network</div>
                        <div className="text-sm opacity-75">Sponsored Content</div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-6xl animate-pulse">🎬</div>
                        <div className="text-xl font-semibold">Playing...</div>
                        <div className="text-sm opacity-75">
                          {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {!isPlaying ? (
                        <Button 
                          size="sm" 
                          onClick={handlePlay}
                          className="bg-white/20 hover:bg-white/30 text-white"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={handleMuteToggle}
                          className="bg-white/20 hover:bg-white/30 text-white"
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                    
                    {canSkip && (
                      <Button 
                        size="sm" 
                        onClick={handleSkip}
                        variant="outline"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        <SkipForward className="h-4 w-4 mr-1" />
                        Skip
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Ad Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            {/* Ad Info */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Sponsored by</span>
                <span className="text-sm text-gray-500">{currentAd.sponsor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Duration</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-sm text-gray-500">{currentAd.duration}s</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              onClick={() => window.open('https://minepi.com/Wain2020', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {currentAd.cta}
            </Button>
          </div>
        </div>

        {/* Completion State */}
        {isCompleted && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ad Completed!</h3>
              <p className="text-gray-600 mb-4">
                Thank you for supporting the Pi Network ecosystem. You can now access the free habit tracker.
              </p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Pi Network powered</span>
              </div>
              <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                Continue to Habit Tracker
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}; 