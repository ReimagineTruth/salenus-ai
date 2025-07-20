import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, XCircle, Key, RefreshCw } from 'lucide-react';
import { validationService, ValidationResult } from '@/lib/validation-service';

export const KeyValidation: React.FC = () => {
  const [key, setKey] = useState('e7021c2ab1db83cf757d65568cf833a8244885a3b9061b4b5601b095fdec8225de72078c49f9cf5d6211ced3a5e541dd54c6c57ebb450f0d30790415be2303d2');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [validationHistory, setValidationHistory] = useState<ValidationResult[]>([]);

  const validateKey = async () => {
    if (!key.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a key to validate.",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);
    
    try {
      console.log('Validating key:', key.trim());
      const result = await validationService.validateKey(key.trim());
      console.log('Validation result:', result);
      
      setValidationResult(result);
      
      // Add to history
      setValidationHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
      
      toast({
        title: result.isValid ? "Validation Successful" : "Validation Failed",
        description: result.message,
        variant: result.isValid ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: "Validation Error",
        description: "An error occurred during validation.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const clearCache = () => {
    validationService.clearCache();
    toast({
      title: "Cache Cleared",
      description: "Validation cache has been cleared.",
    });
  };

  const getCachedResults = () => {
    const cached = validationService.getCachedResults();
    console.log('Cached validation results:', cached);
    toast({
      title: "Cache Info",
      description: `${cached.size} cached validation results`,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="w-5 h-5" />
          <span>Key Validation</span>
        </CardTitle>
        <CardDescription>
          Validate keys against the external validation file at salenus.xyz
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Key Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="validation-key" className="text-sm font-medium">
              Validation Key
            </label>
            <Input
              id="validation-key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter 64-character hex key..."
              className="font-mono text-sm"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={validateKey}
              disabled={isValidating || !key.trim()}
              className="flex-1"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Validate Key
                </>
              )}
            </Button>
            
            <Button
              onClick={clearCache}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={getCachedResults}
              variant="outline"
              size="sm"
            >
              Cache
            </Button>
          </div>
        </div>

        {/* Validation Result */}
        {validationResult && (
          <div className="space-y-4">
            <h3 className="font-semibold">Validation Result</h3>
            
            <div className={`p-4 rounded-lg border ${
              validationResult.isValid 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {validationResult.isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <Badge variant={validationResult.isValid ? "default" : "destructive"}>
                  {validationResult.isValid ? "Valid" : "Invalid"}
                </Badge>
              </div>
              
              <p className="text-sm font-medium mb-2">
                {validationResult.message}
              </p>
              
              {validationResult.timestamp && (
                <p className="text-xs text-gray-500">
                  Validated at: {new Date(validationResult.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Validation History */}
        {validationHistory.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Validation History</h3>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {validationHistory.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border text-sm ${
                    result.isValid 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs">
                      {result.isValid ? "✓" : "✗"} {key.substring(0, 16)}...
                    </span>
                    <Badge variant={result.isValid ? "default" : "destructive"} size="sm">
                      {result.isValid ? "Valid" : "Invalid"}
                    </Badge>
                  </div>
                  {result.timestamp && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">Validation Service:</span>
          <Badge variant="default">
            Active
          </Badge>
        </div>

        {/* Documentation */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Validation Process:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Fetches validation keys from https://salenus.xyz/validation-key.txt</li>
            <li>• Compares your key against the valid keys list</li>
            <li>• Caches results for 5 minutes to improve performance</li>
            <li>• Supports 64-character hex keys</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}; 