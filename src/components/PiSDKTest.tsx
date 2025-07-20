import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

// Following the exact patterns from Pi Network documentation
// Using the centralized Pi interface from pi-network.ts

export const PiSDKTest: React.FC = () => {
  const [authResult, setAuthResult] = useState<any>(null);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Test authentication following official documentation
  const testAuthentication = async () => {
    setIsLoading(true);
    
    try {
      if (typeof window === 'undefined' || !window.Pi) {
        throw new Error('Pi SDK not available');
      }
      
      const Pi = window.Pi;
      
      // Empty array for testing purposes (as per documentation)
      const scopes: string[] = [];
      
      // Empty function that will log an incomplete payment if found
      // Developer needs to implement this callback function
      function onIncompletePaymentFound(payment: any) {
        console.log('Incomplete payment found:', payment);
      }
      
      const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
      console.log('Authentication result:', auth);
      
      setAuthResult(auth);
      setIsAuthenticated(true);
      
      toast({
        title: "Authentication Successful",
        description: `Welcome, ${auth.user?.username || 'User'}!`,
      });
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with Pi Network.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test payment following official documentation
  const testPayment = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please authenticate first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (typeof window === 'undefined' || !window.Pi) {
        throw new Error('Pi SDK not available');
      }
      
      const Pi = window.Pi;
      
      // Payment data following official documentation format
      const paymentData = {
        amount: 1,
        memo: 'This is a Test Payment',
        metadata: { InternalPaymentID: 1234 },
      };

      // Callbacks the developer needs to implement (following documentation exactly)
      const paymentCallbacks = {
        onReadyForServerApproval: function(paymentId: string) {
          console.log('Payment ready for approval:', paymentId);
          // Pass paymentId to your server for approval
          toast({
            title: "Payment Ready for Approval",
            description: `Payment ID: ${paymentId}`,
          });
        },
        
        onReadyForServerCompletion: function(paymentId: string, txid: string) {
          console.log('Payment ready for completion:', paymentId, txid);
          // Pass paymentId and txid to your server for completion
          setPaymentResult({ paymentId, txid, status: 'completed' });
          toast({
            title: "Payment Completed",
            description: `Transaction ID: ${txid}`,
          });
        },
        
        onCancel: function(paymentId: string) {
          console.log('Payment cancelled:', paymentId);
          setPaymentResult({ paymentId, status: 'cancelled' });
          toast({
            title: "Payment Cancelled",
            description: "Payment was cancelled by the user.",
          });
        },
        
        onError: function(error: any, payment: any) {
          console.error('Payment error:', error, payment);
          setPaymentResult({ error, payment, status: 'error' });
          toast({
            title: "Payment Error",
            description: error.message || "An error occurred during payment.",
            variant: "destructive",
          });
        }
      };

      const payment = await Pi.createPayment(paymentData, paymentCallbacks);
      console.log('Payment created:', payment);
      setPaymentResult({ payment, status: 'created' });
      
    } catch (error) {
      console.error('Payment creation error:', error);
      toast({
        title: "Payment Creation Failed",
        description: "Failed to create payment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test with username scope
  const testWithUsername = async () => {
    setIsLoading(true);
    
    try {
      if (typeof window === 'undefined' || !window.Pi) {
        throw new Error('Pi SDK not available');
      }
      
      const Pi = window.Pi;
      
      // Requesting username scope from the Pi App Platform SDK
      const scopes = ['username'];
      
      function onIncompletePaymentFound(payment: any) {
        console.log('Incomplete payment found:', payment);
      }
      
      const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
      console.log('Authentication with username:', auth);
      
      setAuthResult(auth);
      setIsAuthenticated(true);
      
      toast({
        title: "Authentication with Username",
        description: `Welcome, ${auth.user?.username || 'User'}!`,
      });
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with username scope.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test with payments scope
  const testWithPayments = async () => {
    setIsLoading(true);
    
    try {
      if (typeof window === 'undefined' || !window.Pi) {
        throw new Error('Pi SDK not available');
      }
      
      const Pi = window.Pi;
      
      // Requesting payment scope from the Pi App Platform SDK
      const scopes = ['payments'];
      
      function onIncompletePaymentFound(payment: any) {
        console.log('Incomplete payment found:', payment);
      }
      
      const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
      console.log('Authentication with payments:', auth);
      
      setAuthResult(auth);
      setIsAuthenticated(true);
      
      toast({
        title: "Authentication with Payments",
        description: "You can now create payments!",
      });
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with payments scope.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span>Pi SDK Test (Official Documentation)</span>
        </CardTitle>
        <CardDescription>
          Testing Pi Network SDK integration following official documentation patterns
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Authentication Tests */}
        <div className="space-y-4">
          <h3 className="font-semibold">Authentication Tests</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={testAuthentication}
              disabled={isLoading}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-1"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span className="text-xs">Basic Auth</span>
            </Button>
            
            <Button
              onClick={testWithUsername}
              disabled={isLoading}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-1"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span className="text-xs">With Username</span>
            </Button>
            
            <Button
              onClick={testWithPayments}
              disabled={isLoading}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-1"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span className="text-xs">With Payments</span>
            </Button>
          </div>
        </div>

        {/* Payment Test */}
        <div className="space-y-4">
          <h3 className="font-semibold">Payment Test</h3>
          
          <Button
            onClick={testPayment}
            disabled={isLoading || !isAuthenticated}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Test Payment (1 Pi)
              </>
            )}
          </Button>
          
          {!isAuthenticated && (
            <p className="text-sm text-gray-500 text-center">
              Authenticate first to test payments
            </p>
          )}
        </div>

        {/* Results Display */}
        {(authResult || paymentResult) && (
          <div className="space-y-4">
            <h3 className="font-semibold">Results</h3>
            
            {authResult && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Authentication Result:</h4>
                <pre className="text-xs text-green-700 overflow-auto">
                  {JSON.stringify(authResult, null, 2)}
                </pre>
              </div>
            )}
            
            {paymentResult && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Payment Result:</h4>
                <pre className="text-xs text-blue-700 overflow-auto">
                  {JSON.stringify(paymentResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">SDK Status:</span>
          <Badge variant={typeof window !== 'undefined' && window.Pi ? "default" : "destructive"}>
            {typeof window !== 'undefined' && window.Pi ? "Loaded" : "Not Available"}
          </Badge>
        </div>

        {/* Documentation Reference */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Documentation Reference:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Following official Pi Network SDK patterns</li>
            <li>• Using exact callback signatures from documentation</li>
            <li>• Testing all scopes: [], ['username'], ['payments']</li>
            <li>• Payment callbacks match official examples</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}; 