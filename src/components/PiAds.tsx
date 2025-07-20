import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PiNetworkService } from '@/lib/pi-network';
import { toast } from '@/hooks/use-toast';
import { 
  Loader2, 
  Play, 
  Gift, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Zap
} from 'lucide-react';

interface PiAdsProps {
  onAdComplete?: (adType: string, result: any) => void;
  onRewardEarned?: (reward: any) => void;
  className?: string;
}

export const PiAds: React.FC<PiAdsProps> = ({
  onAdComplete,
  onRewardEarned,
  className = ''
}) => {
  const [adsSupported, setAdsSupported] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastAdResult, setLastAdResult] = useState<any>(null);
  const [totalRewards, setTotalRewards] = useState(0);
  const [adStats, setAdStats] = useState({
    interstitial: { shown: 0, successful: 0 },
    rewarded: { shown: 0, successful: 0, rewards: 0 }
  });

  const piService = PiNetworkService.getInstance();

  useEffect(() => {
    checkAdsSupport();
  }, []);

  const checkAdsSupport = async () => {
    try {
      const supported = await piService.checkAdsSupport();
      setAdsSupported(supported);
      
      if (!supported) {
        toast({
          title: "Ads Not Supported",
          description: "Your Pi Browser version doesn't support ads. Please update to the latest version.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking ads support:', error);
      setAdsSupported(false);
    }
  };

  // Basic Interstitial Ad (following official documentation)
  const showBasicInterstitial = async () => {
    setIsLoading(true);
    
    try {
      const result = await piService.showInterstitialAd();
      setLastAdResult({ type: 'interstitial', result });
      
      setAdStats(prev => ({
        ...prev,
        interstitial: {
          ...prev.interstitial,
          shown: prev.interstitial.shown + 1,
          successful: prev.interstitial.successful + (result.result === 'AD_CLOSED' ? 1 : 0)
        }
      }));
      
      onAdComplete?.('interstitial', result);
      
      if (result.result === 'AD_CLOSED') {
        toast({
          title: "Interstitial Ad Completed",
          description: "Ad was shown successfully!",
        });
      } else {
        toast({
          title: "Interstitial Ad Error",
          description: `Ad result: ${result.result}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      toast({
        title: "Ad Error",
        description: "Failed to show interstitial ad.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Advanced Interstitial Ad (following official documentation)
  const showAdvancedInterstitial = async () => {
    setIsLoading(true);
    
    try {
      const success = await piService.showInterstitialAdAdvanced();
      setLastAdResult({ type: 'interstitial_advanced', success });
      
      if (success) {
        setAdStats(prev => ({
          ...prev,
          interstitial: {
            ...prev.interstitial,
            shown: prev.interstitial.shown + 1,
            successful: prev.interstitial.successful + 1
          }
        }));
        
        toast({
          title: "Advanced Interstitial Ad",
          description: "Ad was shown successfully with advanced flow!",
        });
      } else {
        toast({
          title: "Advanced Interstitial Ad",
          description: "Ad could not be shown or loaded.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error showing advanced interstitial ad:', error);
      toast({
        title: "Ad Error",
        description: "Failed to show advanced interstitial ad.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Basic Rewarded Ad (following official documentation)
  const showBasicRewarded = async () => {
    setIsLoading(true);
    
    try {
      const result = await piService.showRewardedAd();
      setLastAdResult({ type: 'rewarded', result });
      
      setAdStats(prev => ({
        ...prev,
        rewarded: {
          ...prev.rewarded,
          shown: prev.rewarded.shown + 1,
          successful: prev.rewarded.successful + (result.result === 'AD_REWARDED' ? 1 : 0)
        }
      }));
      
      onAdComplete?.('rewarded', result);
      
      if (result.result === 'AD_REWARDED') {
        // In a real app, you would verify the adId with Pi Platform API here
        toast({
          title: "Rewarded Ad Completed!",
          description: "You earned a reward! (Ad ID: " + (result.adId?.slice(0, 8) || 'N/A') + "...)",
        });
      } else {
        toast({
          title: "Rewarded Ad Error",
          description: `Ad result: ${result.result}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      toast({
        title: "Ad Error",
        description: "Failed to show rewarded ad.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Advanced Rewarded Ad with Verification (following official documentation)
  const showAdvancedRewarded = async () => {
    setIsLoading(true);
    
    try {
      const result = await piService.showRewardedAdAdvanced();
      setLastAdResult({ type: 'rewarded_advanced', result });
      
      if (result.success) {
        setAdStats(prev => ({
          ...prev,
          rewarded: {
            ...prev.rewarded,
            shown: prev.rewarded.shown + 1,
            successful: prev.rewarded.successful + 1,
            rewards: prev.rewarded.rewards + 1
          }
        }));
        
        setTotalRewards(prev => prev + (result.reward?.amount || 0));
        onRewardEarned?.(result.reward);
        
        toast({
          title: "Reward Earned!",
          description: `You earned ${result.reward?.amount || 0} Pi coins!`,
        });
      } else {
        const errorMessage = result.reward?.error || 'Unknown error';
        toast({
          title: "Rewarded Ad Error",
          description: `Error: ${errorMessage}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error showing advanced rewarded ad:', error);
      toast({
        title: "Ad Error",
        description: "Failed to show advanced rewarded ad.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check Ad Readiness
  const checkAdReadiness = async (adType: 'interstitial' | 'rewarded') => {
    try {
      const result = await piService.isAdReady(adType);
      toast({
        title: `${adType.charAt(0).toUpperCase() + adType.slice(1)} Ad Status`,
        description: result.ready ? "Ad is ready to show!" : "Ad is not ready.",
      });
    } catch (error) {
      console.error('Error checking ad readiness:', error);
      toast({
        title: "Ad Status Error",
        description: "Failed to check ad readiness.",
        variant: "destructive",
      });
    }
  };

  // Request Ad
  const requestAd = async (adType: 'interstitial' | 'rewarded') => {
    try {
      const result = await piService.requestAd(adType);
      toast({
        title: `${adType.charAt(0).toUpperCase() + adType.slice(1)} Ad Request`,
        description: `Result: ${result.result}`,
      });
    } catch (error) {
      console.error('Error requesting ad:', error);
      toast({
        title: "Ad Request Error",
        description: "Failed to request ad.",
        variant: "destructive",
      });
    }
  };

  if (adsSupported === null) {
    return (
      <Card className={`w-full max-w-md ${className}`}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (adsSupported === false) {
    return (
      <Card className={`w-full max-w-md ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>Ads Not Supported</span>
          </CardTitle>
          <CardDescription>
            Your Pi Browser version doesn't support ads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please update your Pi Browser to the latest version to use ads.
              The ad_network feature is not available in your current version.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-2xl ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Gift className="w-5 h-5 text-purple-500" />
          <span>Pi Network Ads</span>
        </CardTitle>
        <CardDescription>
          Official Pi Network Ads SDK integration following documentation patterns
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Ad Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{adStats.interstitial.shown}</div>
            <div className="text-sm text-blue-600">Interstitial Shown</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{adStats.rewarded.shown}</div>
            <div className="text-sm text-green-600">Rewarded Shown</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{adStats.rewarded.rewards}</div>
            <div className="text-sm text-purple-600">Rewards Earned</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{totalRewards.toFixed(1)}</div>
            <div className="text-sm text-yellow-600">Total Pi Earned</div>
          </div>
        </div>

        {/* Interstitial Ads */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Interstitial Ads</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={showBasicInterstitial}
              disabled={isLoading}
              variant="outline"
              className="h-12"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Basic Interstitial
            </Button>
            
            <Button
              onClick={showAdvancedInterstitial}
              disabled={isLoading}
              variant="outline"
              className="h-12"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Advanced Interstitial
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => checkAdReadiness('interstitial')}
              size="sm"
              variant="ghost"
            >
              Check Ready
            </Button>
            <Button
              onClick={() => requestAd('interstitial')}
              size="sm"
              variant="ghost"
            >
              Request Ad
            </Button>
          </div>
        </div>

        {/* Rewarded Ads */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center space-x-2">
            <Gift className="w-4 h-4" />
            <span>Rewarded Ads</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={showBasicRewarded}
              disabled={isLoading}
              className="h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Gift className="w-4 h-4 mr-2" />
              )}
              Basic Rewarded
            </Button>
            
            <Button
              onClick={showAdvancedRewarded}
              disabled={isLoading}
              className="h-12 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Advanced Rewarded
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => checkAdReadiness('rewarded')}
              size="sm"
              variant="ghost"
            >
              Check Ready
            </Button>
            <Button
              onClick={() => requestAd('rewarded')}
              size="sm"
              variant="ghost"
            >
              Request Ad
            </Button>
          </div>
        </div>

        {/* Last Ad Result */}
        {lastAdResult && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium mb-2">Last Ad Result:</h4>
            <pre className="text-xs text-gray-700 overflow-auto">
              {JSON.stringify(lastAdResult, null, 2)}
            </pre>
          </div>
        )}

        {/* Documentation Reference */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center space-x-2">
            <Info className="w-4 h-4" />
            <span>Official Documentation Features:</span>
          </h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Basic and Advanced ad flows</li>
            <li>• Ad readiness checking</li>
            <li>• Manual ad requesting</li>
            <li>• Rewarded ad verification (simulated)</li>
            <li>• Support detection via nativeFeaturesList</li>
            <li>• Error handling for all scenarios</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}; 