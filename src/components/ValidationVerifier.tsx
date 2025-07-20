import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle, ExternalLink, Download, Upload } from 'lucide-react';

const VALIDATION_KEY = 'e7021c2ab1db83cf757d65568cf833a8244885a3b9061b4b5601b095fdec8225de72078c49f9cf5d6211ced3a5e541dd54c6c57ebb450f0d30790415be2303d2';
const VALIDATION_URL = 'https://salenus.xyz/validation-key.txt';

export const ValidationVerifier: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [hostingStatus, setHostingStatus] = useState<'checking' | 'online' | 'offline' | null>(null);

  const checkHostingStatus = async () => {
    setHostingStatus('checking');
    
    try {
      const response = await fetch(VALIDATION_URL, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
          'Cache-Control': 'no-cache'
        }
      });

      if (response.ok) {
        const content = await response.text();
        const isValid = content.trim() === VALIDATION_KEY;
        
        setHostingStatus('online');
        setVerificationResult({
          status: 'success',
          hosting: 'online',
          keyMatch: isValid,
          content: content.trim(),
          expected: VALIDATION_KEY
        });

        toast({
          title: isValid ? "✅ Validation Successful" : "❌ Key Mismatch",
          description: isValid 
            ? "Your validation key is correctly hosted and matches!" 
            : "The hosted key doesn't match the expected key.",
          variant: isValid ? "default" : "destructive",
        });
      } else {
        setHostingStatus('offline');
        setVerificationResult({
          status: 'error',
          hosting: 'offline',
          error: `HTTP ${response.status}: ${response.statusText}`
        });

        toast({
          title: "❌ Hosting Issue",
          description: `The validation file is not accessible at ${VALIDATION_URL}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      setHostingStatus('offline');
      setVerificationResult({
        status: 'error',
        hosting: 'offline',
        error: error instanceof Error ? error.message : 'Network error'
      });

      toast({
        title: "❌ Connection Failed",
        description: "Unable to reach the validation file. Check your hosting setup.",
        variant: "destructive",
      });
    }
  };

  const downloadValidationFile = () => {
    const blob = new Blob([VALIDATION_KEY], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'validation-key.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "📁 File Downloaded",
      description: "validation-key.txt has been downloaded. Upload this to your hosting domain.",
    });
  };

  const openHostingUrl = () => {
    window.open(VALIDATION_URL, '_blank');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span>Validation Key Verifier</span>
        </CardTitle>
        <CardDescription>
          Verify your validation key is correctly hosted at salenus.xyz
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Information */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Validation Key:</h4>
          <div className="font-mono text-xs bg-white p-2 rounded border overflow-x-auto">
            {VALIDATION_KEY}
          </div>
          <p className="text-sm text-blue-700 mt-2">
            Expected URL: <span className="font-mono">{VALIDATION_URL}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={checkHostingStatus}
            disabled={isVerifying}
            className="w-full"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Key
              </>
            )}
          </Button>
          
          <Button
            onClick={downloadValidationFile}
            variant="outline"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Download File
          </Button>
          
          <Button
            onClick={openHostingUrl}
            variant="outline"
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Check URL
          </Button>
        </div>

        {/* Hosting Status */}
        {hostingStatus && (
          <div className="p-4 rounded-lg border">
            <h4 className="font-medium mb-2">Hosting Status:</h4>
            <div className="flex items-center space-x-2">
              {hostingStatus === 'checking' && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking hosting status...</span>
                </>
              )}
              {hostingStatus === 'online' && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-700">File is accessible online</span>
                </>
              )}
              {hostingStatus === 'offline' && (
                <>
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-red-700">File is not accessible</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Verification Result */}
        {verificationResult && (
          <div className="space-y-4">
            <h4 className="font-semibold">Verification Result:</h4>
            
            <div className={`p-4 rounded-lg border ${
              verificationResult.status === 'success' && verificationResult.keyMatch
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {verificationResult.status === 'success' && verificationResult.keyMatch ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <Badge variant={verificationResult.status === 'success' && verificationResult.keyMatch ? "default" : "destructive"}>
                  {verificationResult.status === 'success' && verificationResult.keyMatch ? "Valid" : "Invalid"}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div><strong>Hosting:</strong> {verificationResult.hosting}</div>
                {verificationResult.keyMatch !== undefined && (
                  <div><strong>Key Match:</strong> {verificationResult.keyMatch ? "✅ Yes" : "❌ No"}</div>
                )}
                {verificationResult.error && (
                  <div><strong>Error:</strong> {verificationResult.error}</div>
                )}
                {verificationResult.content && (
                  <div>
                    <strong>Hosted Content:</strong>
                    <div className="font-mono text-xs bg-white p-2 rounded border mt-1 overflow-x-auto">
                      {verificationResult.content}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Setup Instructions:</h4>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. Download the validation-key.txt file above</li>
            <li>2. Upload it to your hosting domain at the root level</li>
            <li>3. Ensure it's accessible at https://salenus.xyz/validation-key.txt</li>
            <li>4. Click "Verify Key" to test the setup</li>
            <li>5. For demo apps, also add the key to your .env file</li>
          </ol>
        </div>

        {/* Environment Variable Setup */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">For Demo App (.env file):</h4>
          <div className="font-mono text-xs bg-white p-2 rounded border">
            PI_VALIDATION_KEY=e7021c2ab1db83cf757d65568cf833a8244885a3b9061b4b5601b095fdec8225de72078c49f9cf5d6211ced3a5e541dd54c6c57ebb450f0d30790415be2303d2
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 