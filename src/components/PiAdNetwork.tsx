import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PiNetworkService } from '@/lib/pi-network';
import { toast } from '@/hooks/use-toast';
import { 
  Loader2, 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX,
  ExternalLink,
  Star,
  Gift
} from 'lucide-react';

interface PiAd {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  reward: number;
  duration: number;
  type: 'video' | 'banner' | 'interstitial';
  callToAction: string;
  targetUrl: string;
}

interface PiAdNetworkProps {
  onAdComplete?: (adId: string, reward: number) => void;
  onAdError?: (error: any) => void;
  className?: string;
  autoPlay?: boolean;
}

export const PiAdNetwork: React.FC<PiAdNetworkProps> = ({
  onAdComplete,
  onAdError,
  className = '',
  autoPlay = false
}) => {
  const [ads, setAds] = useState<PiAd[]>([]);
  const [currentAd, setCurrentAd] = useState<PiAd | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [earnedRewards, setEarnedRewards] = useState(0);

  const piService = PiNetworkService.getInstance();

  // Mock ads data - in real implementation, this would come from Pi Network API
  const mockAds: PiAd[] = [
    {
      id: '1',
      title: 'Earn Pi Rewards',
      description: 'Watch this ad to earn Pi cryptocurrency rewards',
      imageUrl: 'https://via.placeholder.com/300x200/6366f1/ffffff?text=Pi+Ad',
      videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      reward: 0.1,
      duration: 30,
      type: 'video',
      callToAction: 'Watch & Earn',
      targetUrl: 'https://minepi.com'
    },
    {
      id: '2',
      title: 'Pi Network App',
      description: 'Download the Pi Network app to start mining Pi',
      imageUrl: 'https://via.placeholder.com/300x200/ec4899/ffffff?text=Pi+Network',
      reward: 0.05,
      duration: 15,
      type: 'banner',
      callToAction: 'Learn More',
      targetUrl: 'https://minepi.com'
    },
    {
      id: '3',
      title: 'Pi Community',
      description: 'Join the Pi Network community and earn together',
      imageUrl: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Community',
      reward: 0.2,
      duration: 45,
      type: 'video',
      callToAction: 'Join Now',
      targetUrl: 'https://minepi.com'
    }
  ];

  useEffect(() => {
    // Load ads
    setAds(mockAds);
    
    if (autoPlay && mockAds.length > 0) {
      setCurrentAd(mockAds[0]);
    }
  }, [autoPlay]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentAd && currentAd.type === 'video') {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          if (newTime >= duration) {
            handleAdComplete();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentAd, duration]);

  const handleAdComplete = () => {
    if (!currentAd) return;

    setIsPlaying(false);
    setCurrentTime(0);
    
    const reward = currentAd.reward;
    setEarnedRewards(prev => prev + reward);
    
    toast({
      title: "Ad Completed!",
      description: `You earned ${reward} Pi for watching this ad!`,
    });
    
    onAdComplete?.(currentAd.id, reward);
    
    // Move to next ad or reset
    const currentIndex = ads.findIndex(ad => ad.id === currentAd.id);
    const nextAd = ads[currentIndex + 1];
    
    if (nextAd) {
      setCurrentAd(nextAd);
      setDuration(nextAd.duration);
    } else {
      setCurrentAd(null);
    }
  };

  const handlePlayAd = (ad: PiAd) => {
    if (!piService.isUserAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please connect your Pi Network account to watch ads.",
        variant: "destructive",
      });
      return;
    }

    setCurrentAd(ad);
    setDuration(ad.duration);
    setCurrentTime(0);
    
    if (ad.type === 'video') {
      setIsPlaying(true);
    } else {
      // For banner/interstitial ads, complete immediately
      setTimeout(() => {
        handleAdComplete();
      }, 2000);
    }
  };

  const handleSkipAd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentAd(null);
    
    toast({
      title: "Ad Skipped",
      description: "Ad was skipped. No rewards earned.",
    });
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  };

  if (currentAd) {
    return (
      <Card className={`w-full max-w-md ${className}`}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl">Pi Ad Network</CardTitle>
          <CardDescription>
            Watch ads to earn Pi rewards
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Ad Display */}
          <div className="relative">
            <img 
              src={currentAd.imageUrl} 
              alt={currentAd.title}
              className="w-full h-48 object-cover rounded-lg"
            />
            
            {currentAd.type === 'video' && isPlaying && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold mb-2">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      onClick={handleToggleMute}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white hover:text-black"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={handleSkipAd}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white hover:text-black"
                    >
                      <SkipForward className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ad Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{currentAd.title}</h3>
            <p className="text-sm text-gray-600">{currentAd.description}</p>
            
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-sm">
                Reward: {currentAd.reward} Pi
              </Badge>
              <Badge variant="outline" className="text-sm">
                {currentAd.type}
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="flex space-x-2">
            {currentAd.type === 'video' && (
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1"
                disabled={!isPlaying && currentTime > 0}
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
            )}
            
            <Button
              onClick={handleSkipAd}
              variant="outline"
              className="flex-1"
            >
              Skip Ad
            </Button>
          </div>

          {/* Rewards Summary */}
          {earnedRewards > 0 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">
                  Total Earned Today
                </span>
                <Badge variant="secondary" className="text-green-800">
                  {earnedRewards} Pi
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-xl">Pi Ad Network</CardTitle>
        <CardDescription>
          Watch ads to earn Pi cryptocurrency rewards
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <>
            {/* Available Ads */}
            <div className="space-y-3">
              {ads.map((ad) => (
                <div key={ad.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <img 
                      src={ad.imageUrl} 
                      alt={ad.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{ad.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{ad.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {ad.reward} Pi
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {ad.duration}s
                        </Badge>
                      </div>
                    </div>
                    <Button
                      onClick={() => handlePlayAd(ad)}
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Watch
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Rewards Summary */}
            {earnedRewards > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-800">
                    Total Earned Today
                  </span>
                  <Badge variant="secondary" className="text-green-800">
                    {earnedRewards} Pi
                  </Badge>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="text-xs text-gray-500 text-center">
              <p>Connect your Pi Network account to start earning rewards</p>
              <p>Ads are safe and verified by Pi Network</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}; 