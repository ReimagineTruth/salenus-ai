import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PiNetworkService, PiPaymentData, PiPaymentCallbacks } from '@/lib/pi-network';
import { toast } from '@/hooks/use-toast';
import { Loader2, Wallet, CheckCircle, XCircle, AlertCircle, Coins } from 'lucide-react';

interface PiPaymentProps {
  amount: number;
  memo: string;
  metadata?: any;
  onPaymentSuccess?: (paymentId: string, txid: string) => void;
  onPaymentError?: (error: any) => void;
  onPaymentCancel?: () => void;
  className?: string;
  buttonText?: string;
}

type PaymentStatus = 'idle' | 'creating' | 'approving' | 'waiting' | 'completing' | 'success' | 'error' | 'cancelled';

export const PiPayment: React.FC<PiPaymentProps> = ({
  amount,
  memo,
  metadata = {},
  onPaymentSuccess,
  onPaymentError,
  onPaymentCancel,
  className = '',
  buttonText = 'Pay with Pi'
}) => {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [paymentId, setPaymentId] = useState<string>('');
  const [txid, setTxid] = useState<string>('');
  const [error, setError] = useState<string>('');

  const piService = PiNetworkService.getInstance();

  const handlePayment = async () => {
    if (!piService.isUserAuthenticated()) {
      toast({
        title: "Authentication Required",
        description: "Please connect your Pi Network account first.",
        variant: "destructive",
      });
      return;
    }

    setStatus('creating');
    setError('');

    try {
      const paymentData: PiPaymentData = {
        amount,
        memo,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          app: 'Salenus AI'
        }
      };

      // Callbacks the developer needs to implement:
      const callbacks: PiPaymentCallbacks = {
        onReadyForServerApproval: function(paymentId: string) {
          console.log('Payment ready for approval:', paymentId);
          setPaymentId(paymentId);
          setStatus('approving');
          
          // Pass paymentId to your server for approval
          piService.approvePayment(paymentId).then(() => {
            setStatus('waiting');
          }).catch((error) => {
            console.error('Payment approval failed:', error);
            setStatus('error');
            setError('Failed to approve payment');
            onPaymentError?.(error);
          });
        },
        
        onReadyForServerCompletion: function(paymentId: string, txid: string) {
          console.log('Payment ready for completion:', paymentId, txid);
          setTxid(txid);
          setStatus('completing');
          
          // Pass paymentId and txid to your server for completion
          piService.completePayment(paymentId, txid).then(() => {
            setStatus('success');
            onPaymentSuccess?.(paymentId, txid);
            
            toast({
              title: "Payment Successful",
              description: `Payment of ${amount} Pi completed successfully!`,
            });
          }).catch((error) => {
            console.error('Payment completion failed:', error);
            setStatus('error');
            setError('Failed to complete payment');
            onPaymentError?.(error);
          });
        },
        
        onCancel: function(paymentId: string) {
          console.log('Payment cancelled by user:', paymentId);
          setStatus('cancelled');
          onPaymentCancel?.();
          
          toast({
            title: "Payment Cancelled",
            description: "Payment was cancelled by the user.",
          });
        },
        
        onError: function(error: any, payment: any) {
          console.error('Payment error:', error, payment);
          setStatus('error');
          setError(error.message || 'Payment failed');
          onPaymentError?.(error);
          
          toast({
            title: "Payment Failed",
            description: error.message || "An error occurred during payment.",
            variant: "destructive",
          });
        }
      };

      await piService.createPayment(paymentData, callbacks);
    } catch (error) {
      console.error('Payment creation failed:', error);
      setStatus('error');
      setError('Failed to create payment');
      onPaymentError?.(error);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'creating':
      case 'approving':
      case 'waiting':
      case 'completing':
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Coins className="w-5 h-5" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'creating':
        return 'Creating Payment...';
      case 'approving':
        return 'Approving Payment...';
      case 'waiting':
        return 'Waiting for User...';
      case 'completing':
        return 'Completing Payment...';
      case 'success':
        return 'Payment Successful!';
      case 'error':
        return 'Payment Failed';
      case 'cancelled':
        return 'Payment Cancelled';
      default:
        return 'Ready to Pay';
    }
  };

  const getProgressValue = () => {
    switch (status) {
      case 'creating':
        return 25;
      case 'approving':
        return 50;
      case 'waiting':
        return 75;
      case 'completing':
        return 90;
      case 'success':
        return 100;
      default:
        return 0;
    }
  };

  const isProcessing = ['creating', 'approving', 'waiting', 'completing'].includes(status);

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-xl">Pi Network Payment</CardTitle>
        <CardDescription>
          Pay with Pi cryptocurrency securely
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Payment Details */}
        <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium">Amount:</span>
            <Badge variant="secondary" className="text-lg">
              {amount} Pi
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-medium">Memo:</span>
            <span className="text-sm text-gray-600">{memo}</span>
          </div>
          
          {metadata && Object.keys(metadata).length > 0 && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Details:</span>
              <span className="text-sm text-gray-600">
                {Object.keys(metadata).length} item(s)
              </span>
            </div>
          )}
        </div>

        {/* Status Display */}
        {status !== 'idle' && (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              {getStatusIcon()}
              <span className="font-medium">{getStatusText()}</span>
            </div>
            
            {isProcessing && (
              <Progress value={getProgressValue()} className="w-full" />
            )}
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            {status === 'success' && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">
                  Payment completed successfully! Transaction ID: {txid.slice(0, 8)}...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing || status === 'success'}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Payment Complete
            </>
          ) : (
            <>
              <Coins className="w-4 h-4 mr-2" />
              {buttonText}
            </>
          )}
        </Button>

        {/* Security Notice */}
        <p className="text-xs text-gray-500 text-center">
          Your payment is processed securely through Pi Network's blockchain
        </p>
      </CardContent>
    </Card>
  );
}; 