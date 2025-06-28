import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface MockAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const MockAdModal: React.FC<MockAdModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [adWatched, setAdWatched] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setAdWatched(false);
      return;
    }
    setProgress(0);
    setAdWatched(false);
    const duration = 5000; // 5 seconds
    const interval = 100;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      setProgress(Math.min(100, (elapsed / duration) * 100));
      if (elapsed >= duration) {
        clearInterval(timer);
        setAdWatched(true);
      }
    }, interval);
    return () => clearInterval(timer);
  }, [isOpen]);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold mb-2">Watch Ad to Continue</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          {/* Fake ad image or animation */}
          <div className="w-full h-40 bg-gradient-to-br from-blue-200 via-purple-200 to-teal-200 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-indigo-700">[Mock Ad]</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
            <div
              className="bg-indigo-500 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-slate-600">{adWatched ? 'Ad finished! You can continue.' : 'Please watch the ad to continue...'}</span>
        </div>
        <Button
          className="w-full bg-indigo-600 text-white"
          onClick={() => { onClose(); onComplete(); }}
          disabled={!adWatched}
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}; 